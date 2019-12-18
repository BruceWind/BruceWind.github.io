title: raspbian系统下遇到的问题
date: 2016/12/21 01:24:01
updated: 2016/12/21 22:52:11
categories:
- 技术
---
## 1.ssh目录看不见
    手动创建解决。
##　2.git 添加ssh之后依旧无法commit

    1.git init
    2.git config user.name "someone"
    3.git config user.email "someone@someplace.com"
    4.git add *
    5.git commit -m "some init msg


## raspberry下创建添加启动项


    Open a terminal session and edit the file
    
    sudo nano /etc/profile
    
    Add the following line to the end of the file
    
    /home/pi/your_script_name.sh
    
    replace the script name and path with correct name and path of your start-up script. Save and Exit
    
    Press Ctrl+X to exit nano editor followed by Y to save the file.
    
    Here's what my script.sh looked like:
    
    #!/bin/sh
    cd /
    cd home/pi/
    sudo python your_python_sript.py &
    exit 0
    cd /
    I think I made both the script.sh and script.py executable using the chmod
    
    sudo chmod +x home/pi/your_script_name.sh
    sudo chmod +x home/pi/your_python_script.py
    
    
## 开机自动登录帐号
    
    raspbian本身就会开机自动登录tty，所以，开机之后会自动启动shell脚本。