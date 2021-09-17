# React App Template

### What's included

This template is just an extension to the standard `create-react-app` applications with some additional included features:

- Tailwind
- TypeScript
- Authentication with Auth0
- React Query + Axios
- Additional linting
- Netlify deploy scripts

---

### Using this template

This repository is configured to be a "template" repository. You can simply click "Use this template" to create a new repository based on it.

---

### Installation and Setup

Once you've created a new repository based on this template and cloned it locally...

##### Update dependencies

The application relies on several dependencies — such as `react`, `react-scripts`, and `typescript` — that you should ensure are updated to latest version before starting development.

##### Prepare environment variables

Copy the `.env.template` file to create two new files — `.env.local` and `.env.prod`.

The environment variables included in the template are all related to Auth0 support. You can find out more about these variables through the Auth0 documentation.

| Variable                  | Optional | Example value                    |
| ------------------------- | -------- | -------------------------------- |
| REACT_APP_AUTH0_DOMAIN    | No       | your-auth0-app.us.auth0.com      |
| REACT_APP_AUTH0_CLIENT_ID | No       | eD74nNH8QAPewvpCJJcNkQu7LHYTUnEY |
| REACT_APP_AUTH0_AUDIENCE  | Yes      |                                  |

---

### Absolute imports

In an effort to clean up some of the import statements, absolute imports have been configured for the `src` directory.

Instead of writing relative imports:

```
import MyComponent from '../../components/MyComponent
import useCustomHook from '../hooks/useCustomHook
import Urls from '../../../constants/urls
```

You can use:

```
import MyComponent from 'components/MyComponent
import useCustomHook from 'hooks/useCustomHook
import Urls from 'constants/urls
```

---

### Deployment

This template is setup to be deployed to Netlify.

First, build your application using `yarn build`. You will need to ensure you have a `.env.prod` file with your Auth0 variables defined for the application to build properly.

After your application is built, you can deploy to either staging or production using `yarn deploy:staging` or `yarn deploy:prod` respectively.

> The first time you run either of the above commands, you will need to create a new Netlify site or link to an existing one
