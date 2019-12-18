title: 用NDK做了一个AES加密的库
date: 2016/12/04 23:16:33
updated: 2017/12/12 15:46:16
categories:
- 技术
---
##用NDK做了一个AES加密的库，并且做了防止二次打包的校验

> 真刀真枪派不太会写文章，你就听我简单的吹吹牛逼，最后看代码就好了。

********************

很多公司再客户端做的常见的两种加密方案：
> - 在java代码里做加密算法
> - 在native代码里做加密算法

上面两种加密。

**第一种**，他们自己觉得就不够安全，java代码很容易被反编译得到，然后就在打包时用一个第三方的比如：360加固宝，来对dex文件进行加密。这样子代码相当于再混淆，几乎已经无法被看到了，但是不管怎样代码终究在那里，依然会整理出来。但是，目前加壳技术也被破解，搜索360加固脱壳。

**第二种**，这种是常见的了，用native实现，很难看到代码。但是话说回来，jni接口是没有安全性可言的，如果app被反编译，别人只要知道so文件是怎么调用，不需要管你的native加密方式，打包直接调用jni即可，一样可以拿来破解。所以单纯native也是不行，此时你需要做一个签名的校验，防止二次打包。
# 
这就是为什么去做这个开源项目的原因，别人反编译apk拿到了so文件，知道了jni接口怎么调用，即使你的java代码都给他看到了。但是，他只要再次打包，当调用native方法时，native就会先进行签名校验，判断是不是之前我生成的签名文件，如果不是，encode方法返回的就是一串乱码。

apk被二次打包，目前比较牛叉的hack也只能二次打包java文件，so文件的安全性要高很多，这样子的做伐既解决了加密算法代码裸露问题，也解决了被二次打包的问题，完美！！

(^__^)

# 
apk安全领域，最难破解无非就是**keystore**文件，这也是BAT等一线大公司的商用SDK做校验时采用的做法，用判断当前包的keystore文件的**hashcode或者SHA1值**来判断。


## 好了，废话说完了，放出github地址了
[https://github.com/BruceWind/AESJniEncrypt](https://github.com/BruceWind/AESJniEncrypt)


- [x] ndk实现AES加密
- [x] 使用JniOnload 隐藏c函数
- [x] 再做一层防止被二次打包的签名校验
- [x] key存在符号表中，同时隐藏字符表
- [x] 使用obfuscator混淆C的代码
- [x]  增加obfucator对x86的支持,具体配置obfucator的教程底部有链接。
- [x] 手工处理隐藏key，最复杂的方案：将密钥分成不同的几段，存储在不同的代码中，最后将他们拼接起来，可以将整个操作写的很复杂，增加逆向难度。（目前代码里用的是稍微简单的方案）
- [ ] TODO：代码run的时候屏蔽模拟器
- [ ] TODO：防止so代码被code inject
```
char * key = "NMTIzNDU2Nzg5MGFiY2RlZg";//这里是key被做过处理存储在这里的，实际上真实的key是："1234567890abcdef"
```
## 集成

a.先配置local.properties中ndk.dir 要求使用ndk版本必须12b以上.

b.集成到项目中请修改类名方法名,不要暴露加密算法，自行修改key存储到代码里的方案.

c.生成和修改签名.

**c.1.生成**
```
//再当前目录下
$ mkdir  keystore
$ cd keystore/
$ keytool -genkey -alias client1 -keypass 123456 -keyalg RSA -keysize 1024 -validity 365 -storetype PKCS12 -keystore ./androidyuan.keystore
输入密钥库口令:nickname
再次输入新口令:nickname
警告: PKCS12 密钥库不支持其他存储和密钥口令。正在忽略用户指定的-keypass值。
您的名字与姓氏是什么?
  [Unknown]:  nickname
您的组织单位名称是什么?
  [Unknown]:  androidyuan.com
您的组织名称是什么?
  [Unknown]:  androidyuan.com
您所在的城市或区域名称是什么?
  [Unknown]:  shanghai
您所在的省/市/自治区名称是什么?
  [Unknown]:  shanghai
该单位的双字母国家/地区代码是什么?
  [Unknown]:  cn
CN=nickname, OU=xxx.com, O=xxx.com, L=shanghai, ST=shanghai, C=cn是否正确?
  [否]:  y

//测试 keystore口令是否正确
$ keytool -exportcert -alias androiddebugkey -keystore   "androidyuan.keystore" | openssl sha1 -binary | openssl base64
  输入密钥库口令:  nickname
  8GUZG0hBFvUZ1I4kSq/3vowhE7Y=


```

**c.2.取得当前keystore的hash值,并修改native代码中的包名和hash**

    目前似乎没有好的办法，我只能用java取，**getSignature(Context context)**打log取出之后，然后写入到C文件中，重新build项目。
    
  集成到自己项目中请先修改keystore hashcode和包名，防止反编译时拿到so文件，进行二次打包使用。
## 鸣谢

Base64 算法 来自：https://github.com/willemt/pearldb

AES128 算法 来自：https://github.com/kokke/tiny-AES128-C

Native代码混淆器：[obfuscation-o-llvm-ndk](https://fuzion24.github.io/android/obfuscation/ndk/llvm/o-llvm/2014/07/27/android-obfuscation-o-llvm-ndk)


### 注意 : SO会变大的问题

![未混淆的so](https://github.com/BruceWind/AESJniEncrypt/raw/master/img/unobfscator_debugapk.png)
![已混淆的so](https://github.com/BruceWind/AESJniEncrypt/raw/master/img/obfscator_screen.png)

对比： 混淆后的so是混淆前的三倍大小。

### PS:
因为需要做签名校验，所以无法提供jcenter依赖了，望见谅！！

不管代码安全性多高，我依旧反对key存到代码里。


想要编译出混淆过native代码的so需要修改aesjni/build.gradle文件中的externalNativeBuild，并配置NDK下的LLVM。

这是我的NDK配置混淆器教程：[Obfuscator-LLVM-4.0-BUILD-NDK](https://github.com/BruceWind/Obfuscator-LLVM-4.0-BUILD-NDK)




-------------------

有问题及时提:[new issues](https://github.com/BruceWind/AESJniEncrypt/issues/new)