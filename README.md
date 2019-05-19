# Ghost

An electron app for code qulity analysis through git.

## Development

Run local web development server

```bash
$ yarn dev
```

Start the electron development

```bash
$ yarn start-dev
```

### Production mode and packaging app

Package the web content

```bash
$ yarn build
```

Package and create the app

```bash
$ yarn dist
```


### Testing

before testing, change nodeIntegration to true in main.js

Run tests

```bash
$ yarn test
```