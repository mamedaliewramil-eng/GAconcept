"""Build the storefront as a standalone HTML file and ZIP archive."""
from pathlib import Path
from html.parser import HTMLParser
import base64
import re
import zipfile

ROOT = Path(__file__).resolve().parent
TARGET = ROOT.parent / 'ga-checkpoint-new.html'

def embedded(name, mime):
    return 'data:' + mime + ';base64,' + base64.b64encode((ROOT / name).read_bytes()).decode('ascii')

html = (ROOT / 'template.html.in').read_text()
css = (ROOT / 'styles.css').read_text()
css = css.replace('assets/Archivo.ttf', embedded('assets/Archivo.ttf','font/ttf'))
css = css.replace('assets/products.png', embedded('assets/products.png','image/png'))
css = css.replace('assets/products-2.png', embedded('assets/products-2.png','image/png'))
css = css.replace('assets/products-3.png', embedded('assets/products-3.png','image/png'))
css = css.replace('assets/products-4.png', embedded('assets/products-4.png','image/png'))
css = css.replace('assets/products-5.png', embedded('assets/products-5.png','image/png'))
css = css.replace('assets/nautical-compass.png', embedded('assets/nautical-compass.png','image/png'))
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
html = html.replace('assets/hero.png', embedded('assets/hero.png','image/png'))
html = html.replace('assets/hero-2.png', embedded('assets/hero-2.png','image/png'))
html = html.replace('assets/hero-3.png', embedded('assets/hero-3.png','image/png'))
html = html.replace('assets/ga-checkpoint-logo.svg', embedded('assets/ga-checkpoint-logo.svg','image/svg+xml'))
script = (ROOT / 'app.js').read_text()
html = html.replace('<script src="app.js"></script>', '<script>\n' + script + '\n</script>')
html = html.replace('<script src="scenes.js"></script>', '<script>\n' + (ROOT / 'scenes.js').read_text() + '\n</script>')
class OfflineDocument(HTMLParser):
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('img', 'script') and 'src' in attrs:
            assert attrs['src'].startswith('data:'), f'Unembedded {tag}: {attrs["src"]}'
        if tag == 'link' and 'stylesheet' in attrs.get('rel', '').split():
            raise AssertionError('The downloadable HTML still references an external stylesheet')

assert '<style>' in html and '<script>' in html
OfflineDocument().feed(html)
for url in re.findall(r'url\([\s\'"]*([^\)\s\'"]+)', css):
    assert url.startswith(('data:', '#')), f'Unembedded CSS asset: {url}'

# Every public index.html is the same offline document, never the source template.
for target in (TARGET, ROOT.parent / 'index.html', ROOT / 'index.html'):
    target.write_text(html, encoding='utf-8')
with zipfile.ZipFile(ROOT.parent / 'ga-checkpoint-new.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    archive.write(TARGET,'index.html')
    archive.write(ROOT / 'FONT-LICENSE.txt','FONT-LICENSE.txt')
    archive.write(ROOT / 'README.md','README.md')
    archive.writestr('OPEN-ME.txt', 'Распакуйте архив и откройте index.html в браузере.\nВсе изображения, стили, шрифт и скрипты уже внутри HTML.\nДругие файлы и интернет для просмотра не нужны.\n')
print(f'Built {TARGET.name}: {TARGET.stat().st_size:,} bytes')
