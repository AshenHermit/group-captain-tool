from pathlib import Path
import re
import random

def format_paths(text, path_start="./", formatter=None):
    offset = 0
    for pat in re.finditer(r'(\=\"\.\/)(.*?)(\")', text):
        span = pat.span()
        if pat.groups()[1][:2] != "js":
            path = pat.groups()[1]
            if formatter!=None: path = formatter(pat.groups()[1])
            text = text[:span[0]+offset] + '="'+ path_start + path + '"' + text[span[1]+offset:]
            offset += (len(path) - len(pat.groups()[1])) + (len(path_start)-2)
    return text

def main():
    build_folder = "./build"
    file = Path(build_folder+"/index.html")
    original_text = file.read_text(encoding='utf-8')

    routes = ["/waiting", "/login", "/home", "/people-checker", "/people-editor", "/calendar", "/documents-history"]

    text = format_paths(original_text, path_start="./", formatter=lambda x: x+"?v="+str(random.randint(0, 100000000)))
    
    file.write_text(text)

    text = format_paths(text, path_start="../")

    for route in routes:
        filepath = build_folder+route+"/index.html"
        Path(filepath[:filepath.rfind("/")]).mkdir(exist_ok=True)
        file = Path(filepath)
        file.write_text(text)
    
    Path(build_folder).rename("group-captain-tool")

    print("done")


if __name__ == '__main__':
    main()