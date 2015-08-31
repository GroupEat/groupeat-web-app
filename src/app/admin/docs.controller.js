export default class DocsController {
  constructor(api, $window, $location, cfpLoadingBar) {
    'ngInject';

    const dom = $window.document;
    const hash = $location.hash();

    api.get('admin/docs').success(response => {
      if ($location.port() === 3474) { // Replacing the whole dom will get protractor to fail badly
        dom.body.innerHTML = response;
      } else {
        cfpLoadingBar.complete();

        setTimeout(() => {
          dom.open('text/html');
          dom.write(response);
          dom.close();

          if (hash !== '') {
            dom.getElementById(hash).scrollIntoView();
          }
        }, 250);
      }
    });
  }
}
