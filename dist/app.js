"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Person {
    constructor(name) {
        this.name = name;
    }
}
const max = new Person('max');
function count(obj) {
    return {
        value: obj.value,
        ref: obj
    };
}
console.log(count({ value: '1' }));
function getObjectValue(obj, key) {
    return obj[key];
}
let person = { name: 'Max', age: 30 };
console.log(getObjectValue(person, 'age'));
console.log(getObjectValue(person, 'name'));
//console.log(getObjectValue(person, 'last'))   // incorrect because key 'last' isn't included in keys of person object. 
// Operator "keyof" allows to compiler understand it
//=========================================
class Collection {
    constructor(_items) {
        this._items = _items;
    }
    add(item) {
        this._items.push(item);
    }
    remove(item) {
        this._items = this._items.filter(i => i !== item);
    }
    get items() {
        return this._items;
    }
}
let numbers = new Collection([1, 2, 3]);
let strings = new Collection(['a', 'b', 'c']);
//let objs = new Collection([{a: 1}, {b: 2}]);  //incorrect because generics are numbers, strings and booleans
// =================================
// decorators
function Log(constructor) {
    console.log(constructor);
}
function Log2(target, propName) {
    console.log(target);
    console.log(propName);
}
function Log3(target, propName, descriptor) {
    console.log(target);
    console.log(propName);
    console.log(descriptor);
}
let Component1 = class Component1 {
    constructor(name) {
        this.name = name;
    }
    get componentName() {
        return this.name;
    }
    logName() {
        console.log(`Component Name: ${this.name}`);
    }
};
__decorate([
    Log2
], Component1.prototype, "name", void 0);
__decorate([
    Log3
], Component1.prototype, "componentName", null);
__decorate([
    Log3
], Component1.prototype, "logName", null);
Component1 = __decorate([
    Log
], Component1);
function Component(config) {
    return function (Constructor) {
        return class extends Constructor {
            constructor(...args) {
                super(...args);
                const el = document.querySelector(config.selector);
                el.innerHTML = config.template;
            }
        };
    };
}
function Bind(_, _2, descriptor) {
    const original = descriptor.value;
    return {
        configurable: true,
        enumerable: false,
        get() {
            return original.bind(this);
        }
    };
}
let CardComponent = class CardComponent {
    constructor(name) {
        this.name = name;
    }
    logName() {
        console.log(`Component Name: ${this.name}`);
    }
};
__decorate([
    Bind
], CardComponent.prototype, "logName", null);
CardComponent = __decorate([
    Component({
        selector: '#card',
        template: `
        <div class="card">
            <div class="card-content">
                <span class="card-title">Card Component</span>
            </div>
        </div>
    `
    })
], CardComponent);
const card = new CardComponent('My Card Component');
/////
const btn = document.querySelector('#btn');
btn.addEventListener('click', card.logName);
const validators = {};
function Required(target, propName) {
    validators[target.constructor.name] = Object.assign(Object.assign({}, validators[target.constructor.name]), { [propName]: 'required' });
}
function validate(obj) {
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
    constructor(email) {
        this.email = email;
    }
}
__decorate([
    Required
], Form.prototype, "email", void 0);
const form = new Form('email');
if (validate(form)) {
    console.log('Valid: ', form);
}
else {
    console.log('Error: ', form);
}
//# sourceMappingURL=app.js.map