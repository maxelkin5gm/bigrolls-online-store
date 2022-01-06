import main from './partials/main';
import admin from './partials/admin';
import api from './partials/api';
import authenticate from './partials/authenticate';
import MExpress from '../modules/MExpress';

export default (app: MExpress) => {
  main(app);
  admin(app);
  api(app);
  authenticate(app);
};
