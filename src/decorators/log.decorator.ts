// https://stackoverflow.com/questions/46953668/angular-custom-method-decorator-which-triggers-console-log-at-the-beginning

export function log(): MethodDecorator {
  // @ts-ignore
  return function (target: Function, key: string, descriptor: any) {

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {


      let splitted1 =   String(originalMethod).split('{')
      console.log(splitted1)
      console.log(splitted1)

      console.log(String(originalMethod).split('{')[0])


     // console.log(key);
      const result = originalMethod.apply(this, args);

      return result;
    }

    return descriptor;
  }
}


export function logComponent(target: Object, propertyKey: string, descriptor: PropertyDescriptor){



}
