const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'dist');
const context={window:{}};vm.createContext(context);
for(const f of ['lessons.js','problems.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),context);
const {LESSONS,PROBLEMS}=context.window;
assert.equal(LESSONS.length,12);assert.equal(PROBLEMS.length,12);
for(const l of LESSONS){assert.ok(l.title&&l.ruby&&l.csharp&&l.input&&l.output);assert.equal(l.quiz.options.length,3);assert.ok(l.quiz.correct>=0&&l.quiz.correct<3);}
for(const p of PROBLEMS){assert.equal(p.tests.length,3);assert.ok(LESSONS.find(l=>l.id===p.lesson));assert.ok(p.solution.ruby&&p.solution.csharp);assert.equal(p.hints.length,3);}
for(const f of ['app.js','visuals.js','learning-tools.js'])new vm.Script(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');for(const [,asset] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css))"/g))assert.ok(fs.existsSync(path.join(root,asset)),asset);
console.log('PASS: 12 lessons, 12 problems, 36 cases, all assets and JavaScript syntax.');
