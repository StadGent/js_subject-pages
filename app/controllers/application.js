import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service('page-title') pageTitle;
  
  queryParams = ['embed'];
  embed = null;

  get isEmbedded() {
    return !!this.embed;
  }

  get title() {
    return this.pageTitle.title;
  }
}