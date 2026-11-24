from pathlib import Path

root = Path(__file__).parent
pages = ["index", "about", "projects", "gallery", "blog", "contact"]
labels = {
    "index": ("Anasayfa", "Home"),
    "about": ("Hakkımda", "About"),
    "projects": ("Projeler", "Projects"),
    "gallery": ("Galeri", "Gallery"),
    "blog": ("Blog", "Blog"),
    "contact": ("İletişim", "Contact"),
}

def nav(active):
    return "".join(
        f'<a class="{"active" if p == active else ""}" href="{p}.html" '
        f'data-tr="{labels[p][0].upper()}" data-en="{labels[p][1].upper()}">{labels[p][0].upper()}</a>'
        for p in pages
    )

print("Bilingual portfolio generator ready for:", ", ".join(pages))
