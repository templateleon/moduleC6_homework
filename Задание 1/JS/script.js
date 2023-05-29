const json = '{ "list": [ { "name": "Petr", "age": "20", "prof": "mechanic" }, { "name": "Vova", "age": "60", "prof": "pilot" } ] }';

const obj = JSON.parse(json);

console.log(obj); // { list: [ { name: 'Petr', age: '20', prof: 'mechanic' }, { name: 'Vova', age: '60', prof: 'pilot' } ] }

// age значение нужно преобразовать в число, если это требуется
for (let i = 0; i < obj.list.length; i++) {
    obj.list[i].age = Number(obj.list[i].age);
}

console.log(obj); // { list: [ { name: 'Petr', age: 20, prof: 'mechanic' }, { name: 'Vova', age: 60, prof: 'pilot' } ] }