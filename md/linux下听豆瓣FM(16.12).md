title: linux下听豆瓣FM(16.12)
date: 2016/12/15 14:46:31
updated: 2016/12/16 13:47:31
categories:
- 技术
---
    
    由于有听豆瓣的习惯，由于豆瓣API升级，chrome下的doubanfm挂了无法使用了，因为豆瓣官方升级了API，很多客户端都挂了，所以我急需一个新的客户端了。
    google了一下找到这个不错命令行下的douban客户端：[https://github.com/taizilongxu/douban.fm](https://github.com/taizilongxu/douban.fm)
# 
github上已经写的很清楚，但是安装步骤尝试无效。所以，我来写下来我自己的安装过程吧。
其中还遇到一个报错。临时解决了。

## 手动clone代码下来安装
由于，github上提供的安装步骤在我的机器上测试了，用不了，所以我就手动下载安装了。这是手动安装的步骤。
```
$ git clone https://github.com/taizilongxu/douban.fm
$ cd douban.fm/
$ ls
$ doubanfm  img  README.md  setup.py
$ sudo python setup.py --help
'
Common commands: (see --help-commands  for more)

  setup.py build      will build the package underneath  build/ 
  setup.py install    will install the package

Global options:
  --verbose (-v)      run verbosely (default)
  --quiet (-q)        run quietly (turns verbosity off)
  --dry-run (-n)      don t actually do anything
  --help (-h)         show detailed help message
  --no-user-cfg       ignore pydistutils.cfg in your home directory
  --command-packages  list of packages that provide distutils commands

Information display options (just display information, ignore any commands)
  --help-commands     list all available commands
  --name              print package name
  --version (-V)      print package version
  --fullname          print <package name>-<version>
  --author            print the author s name
  --author-email      print the author s email address
  --maintainer        print the maintainer s name
  --maintainer-email  print the maintainer s email address
  --contact           print the maintainer s name if known, else the author s
  --contact-email     print the maintainer s email address if known, else the
                      author s
  --url               print the URL for this package
  --license           print the license of the package
  --licence           alias for --license
  --description       print the package description
  --long-description  print the long package description
  --platforms         print the list of platforms
  --classifiers       print the list of classifiers
  --keywords          print the list of keywords
  --provides          print the list of packages/modules provided
  --requires          print the list of packages/modules required
  --obsoletes         print the list of packages/modules made obsolete

usage: setup.py [global_opts] cmd1 [cmd1_opts] [cmd2 [cmd2_opts] ...]
   or: setup.py --help [cmd1 cmd2 ...]
   or: setup.py --help-commands
   or: setup.py cmd --help'

$ sudo python setup.py build

$ sudo python setup.py install
//报错：
'error: Setup script exited with error: command  x86_64-linux-gnu-gcc  failed with exit status 1'
'解决错误'
$ sudo apt-get install build-essential autoconf libtool pkg-config python-opengl python-imaging python-pyrex python-pyside.qtopengl idle-python2.7 qt4-dev-tools qt4-designer libqtgui4 libqtcore4 libqt4-xml libqt4-test libqt4-script libqt4-network libqt4-dbus python-qt4 python-qt4-gl libgle3 python-dev
 
$ sudo easy_install greenlet
$ sudo easy_install gevent
'好了这下可以安装了 '
$ sudo python setup.py install
'启动'
$ douban.fm
'
➔ Email: 602807247@qq.com
➔ Password: 
Download captcha in /tmp/captcha_pic.jpg
➔ Solution: 
'
```


![github上的图](https://github.com/taizilongxu/douban.fm/raw/master/img/doubanfm.gif)

------------------
## 使用

这里有详细的使用教程：[https://github.com/taizilongxu/douban.fm](https://github.com/taizilongxu/douban.fm)