"""生成 public/default-og.jpg（1200x630）——博客的社交分享封面。

用法：python scripts/make-og.py
依赖：Pillow（pip install pillow）；字体使用 Windows 自带的微软雅黑。
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
BG = (253, 253, 253)
FG = (40, 39, 40)
ACCENT = (0, 108, 172)
MUTED = (107, 114, 128)
BORDER = (236, 233, 233)

FONT_DIR = Path(r"C:\Windows\Fonts")
BOLD = FONT_DIR / "msyhbd.ttc"
REGULAR = FONT_DIR / "msyh.ttc"

OUT = Path(__file__).resolve().parent.parent / "public" / "default-og.jpg"


def main() -> None:
    image = Image.new("RGB", (WIDTH, HEIGHT), BG)
    draw = ImageDraw.Draw(image)

    # 外框
    draw.rectangle([(28, 28), (WIDTH - 28, HEIGHT - 28)], outline=BORDER, width=2)
    # 左上角强调块
    draw.rectangle([(28, 28), (28 + 120, 28 + 8)], fill=ACCENT)

    title_font = ImageFont.truetype(str(BOLD), 96)
    sub_font = ImageFont.truetype(str(REGULAR), 34)
    small_font = ImageFont.truetype(str(REGULAR), 26)
    tag_font = ImageFont.truetype(str(REGULAR), 24)

    draw.text((92, 168), "工程笔记", font=title_font, fill=FG)

    draw.text(
        (96, 320),
        "电力电子 · 动力工程及工程热物理 · 气象学",
        font=sub_font,
        fill=MUTED,
    )

    # 底部栏
    draw.line([(92, 486), (WIDTH - 92, 486)], fill=BORDER, width=2)
    draw.text((92, 512), "公式、图表与那些不太成文的小玩意", font=small_font, fill=MUTED)
    draw.text((WIDTH - 92, 512), "ENGINEERING NOTES", font=tag_font, fill=ACCENT,
              anchor="ra")

    image.save(OUT, quality=92, optimize=True)
    print(f"written: {OUT}")


if __name__ == "__main__":
    main()
