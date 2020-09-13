/*
When you add Redux to your project, start off with something like this:

- src/redux/actions - Create a file for each set of related actions, like userActions.js, productActions.js, etc. I like to bundle action creators and the related action constants in the same file.

- src/redux/reducers - Create a file for each reducer, and an index.js in here to contain the “root” reducer.

- src/redux/configureStore.js - Create and configure the store here. You can just import rootReducer from './reducers'.

If you hate having to jump between files to create an action, check out the Ducks pattern where a reducer + related actions + types are all contained in a single file.
*/
