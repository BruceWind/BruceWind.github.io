title: Junit test with JS
date: 2022/07/26 23:45:24
categories:
- 技术
---

When you write **hybrid app**, you may need to decipher one type of data in two kind of languages such as Java and JS.
And in this case, you must want to execute unit test for test an indentical data for these language codes be cause it is important 
to test two language codes with an idendical data. In this aritcle, I show you one way to test JS functions in **JUnit**.


Follow steps below, I show you how to done it.


First step, we need to prepare for it.

1. Import this JS sourse directory into **JUnit** environment.

2. Modify gradle to import **rhino**, and import JS
```
android {
    sourceSets {
        test {
            resources.srcDirs += ['../web-app/src/components/utils/'] //working for junit test.
        }
    }
}

// import dependence for JS runtime engine.
testImplementation 'org.mozilla:rhino:1.7.14'
```



``` JavaScript
const actionList = [];

function setActionList(list, isTesting){
    if(!Array.isArray(list)) return;

    if (actionList.length > 0) actionList.splice(0, actionList.length);
    if(list.length>0){
        list.forEach(item => {
            if(item.posArray.length > 0){
                actionList.push(item);
            }
        }
        );
    }

    //this line below is used for junit.
    if(isTesting) return JSON.stringify(actionList);
}


```

``` kotlin
    // a method to read text file.
    @Throws(IOException::class)
    fun readFromFile(filename: String?): String? {
        val `is`: InputStream? = javaClass.getResourceAsStream(filename!!)
        val stringBuilder = StringBuilder()
        var i: Int =0
        val b = ByteArray(4096)
        if (`is` != null) {
            while (`is`.read(b).also({ i = it }) != -1) {
                stringBuilder.append(String(b, 0, i))
            }
        }
        return stringBuilder.toString()
    }

    fun testJSAboutTaskChainDataReceived(sentJSONArr: String) {
        val rhino = Context.enter()
        // turn off optimization to work with android
        rhino.optimizationLevel = -1

        val path = "/TaskManager.js"
        val evaluation = "2+2"
        //to test code, there is no needs to try them.
        val scope = rhino.initStandardObjects()
        val result = rhino.evaluateString(scope, evaluation, "JavaScript", 1, null).toString()
        Assert.assertEquals(4f, result.toFloat())


        var text = readFromFile(path)?.replace("export ", "")
        Assert.assertTrue(text!!.isNotEmpty())

        //dont use "let" to define variable in JS, you must use 'const'.
        text += " const data = ${sentJSONArr}; setActionList(data);"
        val evaluation1 =  text
        val result1 = rhino.evaluateString(scope, evaluation1, "JavaScript", 1, null).toString()
        Assert.assertEquals(1, JSONArray(result1).length())

    }

```


### In addition

It is notable that I can not use `let` to define a variable. please look into [Rhino official doc about compatibility](https://mozilla.github.io/rhino/compat/engines.html).

Some tips I should talk about:
1. In some cases, JS would return `undefined` not null so that you may need to care about type of value method `evaluateString()`  returned.
   
    Maybe you can [set config file](https://stackoverflow.com/questions/52333240/how-to-specifiy-es-version-within-js-comment-when-using-eslint) to tell eslint that a JS file should accords to ES5. 
    
2. You can use `String.replace` to convert some ES6 strandard JS code to ES5.