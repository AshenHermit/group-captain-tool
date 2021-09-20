import os

def main():
    os.system("npm run build")
    os.system("python make_routes.py")
    os.system("pause")


if __name__ == '__main__':
    main()