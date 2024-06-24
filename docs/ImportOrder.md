# Import Order

1. 3rd party libraries (react, react-native, etc.)
2. Utils
3. Repositories
4. Services
5. Navigation/ Routes
6. Redux-related (ex: @modules/user/… )
7. icons, images, theme
8. Components (atoms, HOC, molecules, organisms, templates, screens)
9. Domain models
10. interfaces, Constants, mocks

#### Within each of them, you could sort them alphabetically
#### why: Easier to identify dependencies for the class across application layers