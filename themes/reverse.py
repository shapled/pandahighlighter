#!/usr/bin/env python3

import re
import sys
import json

pattern = re.compile(r"(#[a-zA-Z0-9]{3}|#[a-zA-Z0-9]{6})")


usage = r"""usage:
    
    python reverse.py <input.json> <output.json>"""

def do_reverse(root):
    if isinstance(root, dict):
        return {k: do_reverse(v) for k, v in root.items()}
    if isinstance(root, list):
        return [do_reverse(v) for v in root]
    if isinstance(root, str):
        if pattern.match(root):
            return "".join(["#"] + [hex(15 - int(v, 16))[2:].upper() for v in root[1:]])
    return root


def main():
    if len(sys.argv) != 3:
        print(usage)
        return
    with open(sys.argv[1], "rb") as fin:
        v = json.load(fin)
    # print(do_reverse(v))
    with open(sys.argv[2], "wb") as fout:
        fout.write(json.dumps(do_reverse(v), indent=2).encode("utf-8", "ignore"))
    print("Done.")


if __name__ == "__main__":
    main()
