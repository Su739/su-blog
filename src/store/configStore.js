import prod from './configStore.prod';
import dev from './configStore.dev';

export default (process.env.NODE_ENV === 'production' ? prod : dev);
