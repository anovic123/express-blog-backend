"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = void 0;
exports.db = {
    blogs: [],
    posts: [],
    // some: []
};
// функция для быстрой очистки/заполнения базы данных для тестов
const setDB = (dataset) => {
    var _a, _b;
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        exports.db.blogs = [];
        exports.db.posts = [];
        // db.some = []
        return;
    }
    // если что-то передано - то заменяем старые значения новыми,
    // не ссылки - а глубокое копирование, чтобы не изменять dataset
    exports.db.blogs = ((_a = dataset.blogs) === null || _a === void 0 ? void 0 : _a.map(b => (Object.assign({}, b)))) || exports.db.blogs;
    exports.db.posts = ((_b = dataset.posts) === null || _b === void 0 ? void 0 : _b.map(p => (Object.assign({}, p)))) || exports.db.posts;
    // db.some = dataset.some?.map(s => ({...s})) || db.some
};
exports.setDB = setDB;
