"""Build the new, independent storefront as one offline HTML file."""
from pathlib import Path
import base64
import zipfile

ROOT = Path(__file__).resolve().parent
TARGET = ROOT.parent / 'ga-checkpoint-new.html'

def embedded(name, mime):
    return 'data:' + mime + ';base64,' + base64.b64encode((ROOT / name).read_bytes()).decode('ascii')

html = (ROOT / 'index.html').read_text()
css = (ROOT / 'styles.css').read_text()
css = css.replace('assets/Archivo.ttf', embedded('assets/Archivo.ttf','font/ttf'))
css = css.replace('assets/products.png', embedded('assets/products.png','image/png'))
css = css.replace('assets/products-2.png', embedded('assets/products-2.png','image/png'))
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
html = html.replace('assets/hero.png', embedded('assets/hero.png','image/png'))
html = html.replace('assets/hero-2.png', embedded('assets/hero-2.png','image/png'))
html = html.replace('assets/hero-3.png', embedded('assets/hero-3.png','image/png'))
script = (ROOT / 'app.js').read_text()
html = html.replace('<script src="app.js"></script>', '<script>\n' + script + '\n</script>')
html = html.replace('<script src="scenes.js"></script>', '<script>\n' + (ROOT / 'scenes.js').read_text() + '\n</script>')
TARGET.write_text(html)
with zipfile.ZipFile(ROOT.parent / 'ga-checkpoint-new.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    archive.write(TARGET,TARGET.name)
    archive.write(ROOT / 'FONT-LICENSE.txt','FONT-LICENSE.txt')
    archive.write(ROOT / 'README.md','README.md')
print(f'Built {TARGET.name}: {TARGET.stat().st_size:,} bytes')
