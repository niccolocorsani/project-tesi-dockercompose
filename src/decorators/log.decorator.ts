// https://stackoverflow.com/questions/46953668/angular-custom-method-decorator-which-triggers-console-log-at-the-beginning

var classeChiamante = ''
var nuova = false

export function log(generalInfo: string, calledFunctions: []): MethodDecorator {
  // @ts-ignore
  return function (target: Function, key: string, descriptor: any) {


    const originalMethod = descriptor.value;


    descriptor.value = function (...args: any[]) {

      // se non è la stessa di prima la aggiorno.. se non è la stessa di prima vuol dire che la funzione non è ritornata
      if (!classeChiamante.includes(target.constructor.name)) {

        classeChiamante = target.constructor.name
        nuova = true

      }
      let funzioneChiamata = key


      if (key != 'getRandomColor') {
       // console.log(classeChiamante)
      //  console.log('%c' + funzioneChiamata, 'color: #6495ED')
      }


      const result = originalMethod.apply(this, args);
      let splitted1 = String(originalMethod).split('{')


      if (result == null && key != 'getRandomColor')
     //   console.error('return: nothing' + ' ' + splitted1[0])
        console.log()
      else if (result != null && key != 'getRandomColor')
       // console.error('return: ' + typeof (result) + ' ' + splitted1[0])
        console.log()

      return result;
    }
    return descriptor;
  }
}


export function logD3(): MethodDecorator {

  // @ts-ignore
  return function (target: Function, key: string, descriptor: any) {
    const originalMethod = descriptor.value;


    let dateTime = new Date()

    let methodName = String(originalMethod).split('{')
    // console.log(dateTime.getTime() + methodName[0])
  }
}


/*export function log(classNameInfo: string, returnValue: []): MethodDecorator {
  // @ts-ignore
  return function (target: Object, key: string, descriptor: any) {


    const originalMethod = descriptor.value;


    descriptor.value = function (...args: any[]) {

      let splitted1 = String(originalMethod).split('{')
      console.log(splitted1[0] + target.constructor.name);


      const result = originalMethod.apply(this, args);
      let obj = Object.getOwnPropertyNames(Object(key))

      // @ts-ignore
     // console.log(Object.getOwnPropertyNames(obj))


      return result;
    }

    return descriptor;
  }
}


/*export function log(): MethodDecorator {
  // @ts-ignore
  return function (target: Function, key: string, descriptor: any) {
    const originalMethod = descriptor.value;
    let splitted1 = String(originalMethod).split('{')
    let dateTime = new Date()

    console.log(dateTime.getTime()+'%c' + splitted1[0], 'color: #6495ED')
    splitted1.forEach(value => {
      // if (value.includes('Service') && !value.includes('globalVaraibleService'))
      //   console.log('%c' + value, 'color: #6495ED')
      // else if (value.includes('globalVaraibleService'))
      //   console.error()
      // else console.log()
    })
  }
}*/


export function classDecorator(constructor: Function) {

  //console.log(constructor.prototype)
}
