import * as React from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { Alert, PageSection } from '@patternfly/react-core';
import { accessibleRouteChangeHandler } from '@app/utils/utils';
import { TrafficMap } from '@app/TrafficMap/TrafficMap';
import { ParkingMap } from '@app/ParkingMap/ParkingMap';
import { NotFound } from '@app/NotFound/NotFound';
import DocumentTitle from 'react-document-title';
import { LastLocationProvider, useLastLocation } from 'react-router-last-location';
let routeFocusTimer: number;

const RouteWithTitleUpdates = ({ component: Component, isAsync = false, title, ...rest }) => {
  const lastNavigation = useLastLocation();

  function routeWithTitle(routeProps: RouteComponentProps) {
    return (
      <DocumentTitle title={title}>
        <Component {...rest} {...routeProps} />
      </DocumentTitle>
    );
  }

  React.useEffect(() => {
    if (!isAsync && lastNavigation !== null) {
      routeFocusTimer = accessibleRouteChangeHandler();
    }
    return () => {
      clearTimeout(routeFocusTimer);
    };
  }, []);

  return <Route render={routeWithTitle} />;
};

export interface IAppRoute {
  label: string;
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  icon: any;
  exact?: boolean;
  path: string;
  title: string;
  isAsync?: boolean;
}

const routes: IAppRoute[] = [
  {
    component: TrafficMap,
    exact: true,
    icon: null,
    label: 'Traffic Map',
    path: '/',
    title: 'Traffic Map'
  },
  {
    component: ParkingMap,
    exact: true,
    icon: null,
    isAsync: true,
    label: 'Parking Map',
    path: '/parking-map',
    title: 'Parking Map'
  }
];

const AppRoutes = () => (
  <LastLocationProvider>
    <Switch>
      {routes.map(({ path, exact, component, title, isAsync, icon }, idx) => (
        <RouteWithTitleUpdates
          path={path}
          exact={exact}
          component={component}
          key={idx}
          icon={icon}
          title={title}
          isAsync={isAsync}
        />
      ))}
      <RouteWithTitleUpdates component={NotFound} title={'404 Page Not Found'} />
    </Switch>
  </LastLocationProvider>
);

export { AppRoutes, routes };
