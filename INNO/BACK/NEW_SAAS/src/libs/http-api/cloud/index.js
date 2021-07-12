import Goods from './goods';
import Order from './order';
import Settings from './settings';
import Activity from './activity';
import Data from './data';

export default {
  ...Goods,
  ...Order,
  ...Settings,
  ...Activity,
	...Data
}