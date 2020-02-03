class Person {
    constructor(private name: string) {}
}

const max = new Person('max');

interface IVal {
    value: string
}

function count<T extends IVal>(obj: T): {value: string, ref: T} {
    return {
        value: obj.value,
        ref: obj
    };
}

console.log(count({value: '1'}));

function getObjectValue<T extends object, R extends keyof T>(obj: T, key: R) {
    return obj[key];
}

let person = {name: 'Max', age: 30};
console.log(getObjectValue(person, 'age'))
console.log(getObjectValue(person, 'name'))
//console.log(getObjectValue(person, 'last'))   // incorrect because key 'last' isn't included in keys of person object. 
                                                // Operator "keyof" allows to compiler understand it

//=========================================
class Collection<T extends number | string | boolean> {
    constructor(private _items: T[]) {}

    add(item: T) {
        this._items.push(item);
    }

    remove(item: T) {
        this._items = this._items.filter(i => i !== item);
    }

    get items(): T[] {
        return this._items;
    }
}

let numbers = new Collection([1, 2, 3]);
let strings = new Collection(['a', 'b', 'c']);
//let objs = new Collection([{a: 1}, {b: 2}]);  //incorrect because generics are numbers, strings and booleans


// =================================
// decorators
function Log(constructor: Function) {
    console.log(constructor);
}

function Log2(target: any, propName: string | Symbol) {
    console.log(target);
    console.log(propName);
}

function Log3(target: any, propName: string | Symbol, descriptor: PropertyDescriptor) {
    console.log(target);
    console.log(propName);
    console.log(descriptor);
}

@Log
class Component1 {
    @Log2
    name: string

    @Log3
    get componentName() {
        return this.name;
    }

    constructor(name: string) {
        this.name = name;
    }

    @Log3
    logName(): void {
        console.log(`Component Name: ${this.name}`);
    }
}

//======================
interface ComponentDecorator{
    selector: string,
    template: string
}


function Component(config: ComponentDecorator) {
    return function<T extends {new(...args: any[]): object}>(Constructor: T) {
        return class extends Constructor {
            constructor(...args: any[]) {
                super(...args);

                const el = document.querySelector(config.selector)!;
                el.innerHTML = config.template;
            }
        }
    }
}

function Bind(_: any, _2: any, descriptor: PropertyDescriptor): PropertyDescriptor {
    const original = descriptor.value;

    return {
        configurable: true,
        enumerable: false,
        get() {
            return original.bind(this);
        }
    };
}

@Component({
    selector: '#card',
    template: `
        <div class="card">
            <div class="card-content">
                <span class="card-title">Card Component</span>
            </div>
        </div>
    `
})
class CardComponent {
    constructor(public name: string) {}

    @Bind
    logName(): void {
        console.log(`Component Name: ${this.name}`);
    }
}

const card = new CardComponent('My Card Component');

/////
const btn = document.querySelector('#btn')!

btn.addEventListener('click', card.logName);

/////======================

type ValidatorType = 'required' | 'email'

interface ValidatorConfig {
    [prop: string]: {
        [validateProp: string]: ValidatorType
    }
}

const validators: ValidatorConfig = {

};

function Required(target: any, propName: string) {
    validators[target.constructor.name] = {
        ...validators[target.constructor.name],
        [propName]: 'required'
    }
}

function validate(obj: any): boolean {
    const objConfig = validators[obj.constructor.name];
    if (!objConfig) {
        return true;
    }
    let isValid = true;
    Object.keys(objConfig).forEach(key => {
        if (objConfig[key] === 'required') {
            isValid = isValid && !!obj[key];
        }
    });
    return isValid;
}

class Form {
    @Required
    email: string | void

    constructor(email?: string) {
        this.email = email;
    }
}

const form = new Form('email');

if (validate(form)) {
    console.log('Valid: ', form);
} else {    
    console.log('Error: ', form);
}

// ====================================
// namespaces

/// <reference path="form-namespace.ts" />

namespace Form {
    class MyForm {
        private type: FormType = 'inline';
        private state: FormState = 'active';
    
        constructor(
            public emal: string
        ) {}
    
        getInfo(): FormInfo {
            return {
                type: this.type,
                state: this.state
            }
        }
    }
    
    const form2 = new Form('v@mail.ru');
}
