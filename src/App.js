import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { GlobalStyle } from './styles/global'
import { ErrorBoundary } from './components/ErrorBoundary'

import * as ROUTES from './routes'

import { Result } from './pages/Result'
import { Standings20 } from './pages/Standings20'
import { Standings20Top } from './pages/Standings20Top'
import { Standings20Klasik } from './pages/Standings20Klasik'

const App = () => (
  <>
    <GlobalStyle />
    <ErrorBoundary>
      <Switch>
        <Route
          path={ROUTES.HOMEPAGE}
          exact
          render={() => <Redirect to={ROUTES.RESULT} />}
        />
        <Route path={ROUTES.RESULT} exact component={Result} />
        <Route path={ROUTES.STANDINGS20} exact component={Standings20} />
        <Route path={ROUTES.STANDINGS20TOP} exact component={Standings20Top} />
        <Route
          path={ROUTES.STANDINGS20KLASIK}
          exact
          component={Standings20Klasik}
        />
      </Switch>
    </ErrorBoundary>
  </>
)

export { App }
