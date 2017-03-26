class CameraController {
  constructor($http, $state) {
    'ngInject';

    this.$http = $http;

  }

  takePhoto() {

    window.imagePicker.getPictures(
    	(results) => {
        console.log('Results: ', results);
    		this.process(results);
    	}, (error) => {
    		console.log('Error: ' + error); // log
    	}, {
    		maximumImagesCount: 100,
    	}
    );

  }

  process(images) {
    let base64Images = images.map(image => this.getFileContentAsBase64(image));
    Promise.all(base64Images)
      .then(images => {

        // TODO: gzip images

        const request = {
          method: 'POST',
          data: {
            images
          },
          url: 'http://192.168.0.102:3000/process' // TODO: move IP address into config
        };

        this.$http(request)
          .then((res) => {
            this.images = res.data.images;
          })
          .catch(err => console.log(err));

      })
      .catch(err => {
        console.log('catch', err); // log
      });
  }

  getFileContentAsBase64(path) {

    return new Promise((resolve, reject) => {

      window.resolveLocalFileSystemURL(path, (fileEntry) => {
        fileEntry.file(function(file) {
          const reader = new FileReader();
          reader.onloadend = function(e) {
            const body = this.result;
            resolve({ body });

            // // Create an image element that we will load the data into
            // let image = new Image();
            // image.onload = function(evt) {
            //     // The image has been loaded and the data is ready
            //
            //     const height = this.height;
            //     const width = this.width;
            //
            //     // We don't need the image element anymore. Get rid of it.
            //     image = null;
            //
            //     resolve({ body, height, width });
            // }
            // image.src = body;
          };
          reader.readAsDataURL(file);
        });
      }, (err) => {
        reject(err);
      });

    });

  }

}

export { CameraController };
