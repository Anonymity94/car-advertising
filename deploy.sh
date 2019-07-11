yarn build

ssh dev@39.106.231.234 "cd /home/dev/web-dir/dist && rm -rf *"
scp -r dist dev@39.106.231.234:/home/dev/web-dir
