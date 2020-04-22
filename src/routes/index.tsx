import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => (
  <Switch>
    {/* exact means the react will match the exact name "repository" */}
    <Route path="/" exact component={Dashboard} />
    {/* the character + means that everything that goes after repository is a parameter */}
    <Route path="/repository/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
