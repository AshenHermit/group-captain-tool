import os
from argparse import ArgumentParser
import make_routes
import ftplib
import traceback

output_folder = "group-captain-tool"

def build():
    os.system("npm run build")
    make_routes.make_routes(output_folder)

def upload(ftp_host, ftp_username, ftp_password, ftp_folder):
    print(f'uploading with ftp to "{ftp_folder}"')
    ftp = ftplib.FTP(ftp_host, ftp_username, ftp_password)
    ftp.cwd(ftp_folder)

    def upload_folder(path):
        files = os.listdir(path)
        os.chdir(path)
        for f in files:
            if os.path.isfile(f):
                fh = open(f, 'rb')
                ftp.storbinary(f'STOR {f}', fh)
                print(f"stor {f}")
                fh.close()
            elif os.path.isdir(f):
                if not f in ftp.nlst(): ftp.mkd(f)
                ftp.cwd(f)
                print(f"cwd {f}")
                upload_folder(f)
        ftp.cwd('..')
        os.chdir('..')
        print("cwd ..")
    upload_folder(output_folder)

def main():
    parser = ArgumentParser()
    parser.add_argument("-u", "--upload", action="store_true")
    parser.add_argument("--ftp-host", type=str)
    parser.add_argument("--ftp-username", type=str)
    parser.add_argument("--ftp-password", type=str)
    parser.add_argument("--ftp-folder", type=str)
    args = parser.parse_args()

    try:
        build()
        if args.upload:
            upload(args.ftp_host, args.ftp_username, args.ftp_password, args.ftp_folder)
        print("done.")
    except Exception as e:
        traceback.print_exc()


if __name__ == '__main__':
    main()