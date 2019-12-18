title: java反射中的难题
date: 2016/07/04 14:24:18
updated: 2016/11/25 11:35:54
categories:
- 技术
---
## 1.访问私有对象（这个是比较简单，不算是难题）

使用反射:
```
        Field field[] = reClass.getDeclaredFields();
        field[0].setAccessible(true);
        field[0].set(obj, value);//给obj的一个属性设置value
```

## 2.访问私有方法 （这个是比较简单，不算是难题）

        Method[] methods = reClass.getDeclaredMethods();
        methods[0].setAccessible(true);
        methods[i].invoke(obj)；//调用obj的一个带参数方法

## 3.某个类使用private修饰了无参构造函数()
```
//使用私有构造函数创建实例化这个对象
    Constructor[] constructors = cls.getDeclaredConstructors();
	constructors[0].setAccessible(true);
	constructors[0].newInstance( )
```

## 4.某个类使用private修饰了带参构造函数,如果你特么的还非要访问这个带参构造函数的话

```
public class FooCls {

    private FooCls(int i)
    {}
}


//实例化带参私有构造函数
    int i=0;
    Constructor[] constructors = cls.getDeclaredConstructors();
	constructors[0].setAccessible(true);
	constructors[0].newInstance(i);
```
## 5.实例化内部类 （这个也是很困难）

```
    /**
     * 解决内部类无法构造问题
     * @param parentClass  必须提供父类 否则无法实例化内部类
     * @param reClass  内部类class
     * @return 实例化之后的内部类对象
     * @throws IllegalAccessException
     * @throws InstantiationException
     * @throws InvocationTargetException
     */
private Object createInnerClsObj(Class parentClass,Class reClass) throws IllegalAccessException, InstantiationException, InvocationTargetException {

        Object  parent=createObj(parentClass);

        Constructor[] cons = reClass.getDeclaredConstructors();//强制让 private 构造函数可以访问
        cons[0].setAccessible(true);
        return cons[0].newInstance(parent);// 调用无参构造函数  只是子类的构建需要父类的支持
    }
    
    
    private Object createObj(Class reClass) throws IllegalAccessException, InvocationTargetException, InstantiationException {

        Constructor[] cons = reClass.getDeclaredConstructors();//强制让 private 构造函数可以访问
        cons[0].setAccessible(true);
        return cons[0].newInstance();// 调用无参构造函数
    }
```

## 6.类只提供了带参构造函数，想要实例化这个对象并通过无参构造去实例化

    因为你只有带参构造函数，所以这里想要使用无参构造就变得异常艰难，java官方设计就不想让你这么做，我找了很多方案都发现没有这种方案。所以我选择试试fastjso怎样。
    
测试，发现其实fastjson也没有实现这个功能，我用fastjsonparse字符串的时候，一旦给的一个class只有一个带参的构造函数，类似上面**4**的，他就无法通过反射帮我实例化了，直接返回空对象回来。

测试用代码如下:
```
public class FooCls {

    public FooCls(int i)
    {}
    int  els=0;
}

        //测试
        QMJSONHelper qmjsonHelper=new QMJSONHelper("{\"els\":1}");
        FooCls foo=(FooCls)qmjsonHelper.parse2Model(FooCls.class);
        Log.d("foo",foo.toString());
    

```
后来，实验Gson竟然是可以得到这个对象的。666！！ 谷歌团队黑科技！！


# 不行我要学习。
仔细阅读GSON的源码，并且进去调试，发现`UnsafeAllocator`这个类。内部使用反射得到了`Unsafe`这个类，但是这个类压根就没有开放出来，我无法引用这个类。所以谷歌故意通过Class.forName()去得到这个类，然后执行了这个类的一个static方法。
```
public abstract class UnsafeAllocator {
  public abstract <T> T newInstance(Class<T> c) throws Exception;

  public static UnsafeAllocator create() {
    // try JVM
    // public class Unsafe {
    //   public Object allocateInstance(Class<?> type);
    // }
    try {
      Class<?> unsafeClass = Class.forName("sun.misc.Unsafe");
      Field f = unsafeClass.getDeclaredField("theUnsafe");
      f.setAccessible(true);
      final Object unsafe = f.get(null);
      final Method allocateInstance = unsafeClass.getMethod("allocateInstance", Class.class);
      return new UnsafeAllocator() {
        @Override
        @SuppressWarnings("unchecked")
        public <T> T newInstance(Class<T> c) throws Exception {
          assertInstantiable(c);
          return (T) allocateInstance.invoke(unsafe, c);
        }
      };
    } catch (Exception ignored) {
    }

    // try dalvikvm, post-gingerbread
    // public class ObjectStreamClass {
    //   private static native int getConstructorId(Class<?> c);
    //   private static native Object newInstance(Class<?> instantiationClass, int methodId);
    // }
    try {
      Method getConstructorId = ObjectStreamClass.class
          .getDeclaredMethod("getConstructorId", Class.class);
      getConstructorId.setAccessible(true);
      final int constructorId = (Integer) getConstructorId.invoke(null, Object.class);
      final Method newInstance = ObjectStreamClass.class
          .getDeclaredMethod("newInstance", Class.class, int.class);
      newInstance.setAccessible(true);
      return new UnsafeAllocator() {
        @Override
        @SuppressWarnings("unchecked")
        public <T> T newInstance(Class<T> c) throws Exception {
          assertInstantiable(c);
          return (T) newInstance.invoke(null, c, constructorId);
        }
      };
    } catch (Exception ignored) {
    }

    // try dalvikvm, pre-gingerbread
    // public class ObjectInputStream {
    //   private static native Object newInstance(
    //     Class<?> instantiationClass, Class<?> constructorClass);
    // }
    try {
      final Method newInstance = ObjectInputStream.class
          .getDeclaredMethod("newInstance", Class.class, Class.class);
      newInstance.setAccessible(true);
      return new UnsafeAllocator() {
        @Override
        @SuppressWarnings("unchecked")
        public <T> T newInstance(Class<T> c) throws Exception {
          assertInstantiable(c);
          return (T) newInstance.invoke(null, c, Object.class);
        }
      };
    } catch (Exception ignored) {
    }

    // give up
    return new UnsafeAllocator() {
      @Override
      public <T> T newInstance(Class<T> c) {
        throw new UnsupportedOperationException("Cannot allocate " + c);
      }
    };
  }

  /**
   * Check if the class can be instantiated by unsafe allocator. If the instance has interface or abstract modifiers
   * throw an {@link UnsupportedOperationException}
   * @param c instance of the class to be checked
   */
  private static void assertInstantiable(Class<?> c) {
    int modifiers = c.getModifiers();
    if (Modifier.isInterface(modifiers)) {
      throw new UnsupportedOperationException("Interface can't be instantiated! Interface name: " + c.getName());
    }
    if (Modifier.isAbstract(modifiers)) {
      throw new UnsupportedOperationException("Abstract class can't be instantiated! Class name: " + c.getName());
    }
  }
}
```
# 
```
    //用法很简单：
    final UnsafeAllocator unsafeAllocator = UnsafeAllocator.create();
    return unsafeAllocator.newInstance(reClass);

```

用Gson里面这个UnsafeAllocator 可以完美实现不开放默认构造函数的类的实例化。这个方案同时可以解决**4**的问题。

## 7.取得泛型的类型，并new出来(这个很困难，多数人都告诉我：不能)
```
//给出我在 MVP中的例子

public abstract class BaseCommActivity<P extends BaseCommPresenter> extends FragmentActivity implements IBaseCommView,OnClickListener,OnReciverListener {


    protected P presenter;

    public BaseCommActivity() {

        try {
            //执行默认 构造函数
//            presenter = getPsClass().newInstance();

            Class<P> cls=((Class)((ParameterizedType)getClass().getGenericSuperclass()).getActualTypeArguments()[0]);

            Constructor[] constructors=cls.getDeclaredConstructors();
            constructors[0].setAccessible(true);//这句代码 意义不大 仅仅防止构造函数private

            presenter=cls.newInstance();

        } catch (InstantiationException e) {
            e.printStackTrace();//这个异常通常不会发生 除非你的泛型类型是 Integer Boolean Long 这些
        } catch (IllegalAccessException e) {
            e.printStackTrace();  //
        }

        presenter.setIView(this);
    }

```



## Java Doc上的说明


    getFields()获得某个类的所有的公共（public）的字段，包括父类。 

    getDeclaredFields()获得某个类的所有申明的字段，即包括public、private和proteced，但是不包括父类的申明字段。 

    同样类似的还有getConstructors()和getDeclaredConstructors()，getMethods()和getDeclaredMethods()。



    Method getDeclaredMethod(String name, Class… parameterTypes)d 
          返回一个 Method 对象，该对象反映此 Class 对象所表示的类或接口的指定已声明方法。 
    Method[] getDeclaredMethods() 
          返回 Method 对象的一个数组，这些对象反映此 Class 对象表示的类或接口声明的所有方法，包括公共、保护、默认（包）访问和私有方法，但不包括继承的方法。 
    Method getMethod(String name, Class… parameterTypes) 
          返回一个 Method 对象，它反映此 Class 对象所表示的类或接口的指定公共成员方法。 
    Method[] getMethods() 
          返回一个包含某些 Method 对象的数组，这些对象反映此 Class 对象所表示的类或接口（包括那些由该类或接口声明的以及从超类和超接口继承的那些的类或接口）的公共 member 方法。 
    getDeclaredField(String name) 
          返回一个 Field 对象，该对象反映此 Class 对象所表示的类或接口的指定已声明字段。 
    Field[] getDeclaredFields() 
          返回 Field 对象的一个数组，这些对象反映此 Class 对象所表示的类或接口所声明的所有字段，包括公共、保护、默认（包）访问和私有字段，但不包括继承的字段。


# 
# 
> - https://dunwood.blogspot.com/2004/05/instantiate-java-class-that-has.html


