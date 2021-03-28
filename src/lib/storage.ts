import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export default storage.bucket('cyberiumdev-rmit-cc.appspot.com');
