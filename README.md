# Ghost
<img src="assets/ghost_pacman.png" height="150px" />

### Welcome
<p>
  This is <b>Ghost</b>, an electron app for code quality analysis through git.
</p>
<p>
  Just enter a branchname or branchtype you want to analyse and select your .git-repository.<br>
  Ghost will show all file occurrence within these branches and provide statistics for you.
</p>

## Initialize

Load project dependencies

```bash
$ yarn install
```

## Development

Run local web development server

```bash
$ yarn dev
```

Start the electron development

```bash
$ yarn start-dev
```

## Production mode and packaging app

Package the web content

```bash
$ yarn build
```

Package and create the app

```bash
$ yarn dist
```


### Testing

Before testing, change nodeIntegration to true in main.js

run local web dev server

```bash
$ yarn dev
```

Run tests

```bash
$ yarn test
```
