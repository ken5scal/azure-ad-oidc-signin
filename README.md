% git clone https://github.com/AzureAD/microsoft-authentication-library-for-js.git                                                              (git)-[dev]
% cd samples/msal-browser-samples/TypescriptTestApp2.0
% npm install
% npm start
```
% npm start                                                                                                                                     (git)-[dev]

> typescript-test-app-2.0@1.0.0 prestart /Users/Kengo/workspace/microsoft-authentication-library-for-js/samples/msal-browser-samples/TypescriptTestApp2.0
> npm run clean && npm run build && npm run copy-views


> typescript-test-app-2.0@1.0.0 clean /Users/Kengo/workspace/microsoft-authentication-library-for-js/samples/msal-browser-samples/TypescriptTestApp2.0
> npm run clean:build && rimraf dist


> typescript-test-app-2.0@1.0.0 clean:build /Users/Kengo/workspace/microsoft-authentication-library-for-js/samples/msal-browser-samples/TypescriptTestApp2.0
> rimraf build-tsc build-babel


> typescript-test-app-2.0@1.0.0 build /Users/Kengo/workspace/microsoft-authentication-library-for-js/samples/msal-browser-samples/TypescriptTestApp2.0
> tsc && npm run build:babel && npm run build:webpack && npm run clean:build


> typescript-test-app-2.0@1.0.0 build:babel /Users/Kengo/workspace/microsoft-authentication-library-for-js/samples/msal-browser-samples/TypescriptTestApp2.0
> babel build-tsc --out-dir build-babel --source-maps

Successfully compiled 6 files with Babel (1502ms).

> typescript-test-app-2.0@1.0.0 build:webpack /Users/Kengo/workspace/microsoft-authentication-library-for-js/samples/msal-browser-samples/TypescriptTestApp2.0
> webpack

Hash: 1ec1ed0c584c1df8e367
Version: webpack 4.43.0
Time: 685ms
Built at: 2020/07/20 1:14:08
        Asset     Size  Chunks                   Chunk Names
    bundle.js  118 KiB       0  [emitted]        main
bundle.js.map  506 KiB       0  [emitted] [dev]  main
Entrypoint main = bundle.js bundle.js.map
 [5] ./build-babel/UIManager.js 4.12 KiB {0} [built]
 [6] ./build-babel/Constants.js 376 bytes {0} [built]
 [7] ./build-babel/index.js 5 KiB {0} [built]
 ```