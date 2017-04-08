angular.module('iDexApp')
    .factory('Utility', [() => {
      function toggleSort(createdIndex) {
        const allwords = [];
        const resultObject = {};
        Object.keys(createdIndex).map((word) => {
          allwords.push(word);
        });
        allwords.sort();
        allwords.map((word) => {
          resultObject[word] = `${createdIndex[word]}`;
        });
        return resultObject;
      }

      function toggleSortInnerText(buttonToShow, buttonToHide) {
        document.getElementById(buttonToShow).style.display = 'inline';
        document.getElementById(buttonToShow).innerText = 'Toggle sort indexes';
        document.getElementById(buttonToHide).style.display = 'none';
      }

      function newlyCreatedIndexInnerText() {
        toggleSortInnerText('toggele-sort', 'toggele-sortB');
        document.getElementById('create-index').innerText = 'Indexes created';
      }

      function feedback(message) {
        document.getElementById('modal-body').innerText = message;
        $('#iDexModal').modal();
      }

      return {
        toggleSort,
        toggleSortInnerText,
        newlyCreatedIndexInnerText,
        feedback,
      };
    }]);
