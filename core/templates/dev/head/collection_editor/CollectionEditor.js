// Copyright 2016 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Primary controller for the collection editor page.
 */

// TODO(bhenning): These constants should be provided by the backend.
oppia.constant(
  'COLLECTION_DATA_URL_TEMPLATE', '/collection_handler/data/<collection_id>');
oppia.constant(
  'WRITABLE_COLLECTION_DATA_URL_TEMPLATE',
  '/collection_editor_handler/data/<collection_id>');
oppia.constant(
  'COLLECTION_RIGHTS_URL_TEMPLATE',
  '/collection_editor_handler/rights/<collection_id>');
oppia.constant(
  'EXPLORATION_SUMMARY_DATA_URL_TEMPLATE', '/explorationsummarieshandler/data');

oppia.controller('CollectionEditor', [
  '$scope', 'WritableCollectionBackendApiService', 'CollectionObjectFactory',
  'SkillListObjectFactory', 'alertsService',
  function(
      $scope, WritableCollectionBackendApiService, CollectionObjectFactory,
      SkillListObjectFactory, alertsService) {
    $scope.collection = null;
    $scope.collectionSkillList = SkillListObjectFactory.create([]);

    var _collectionId = GLOBALS.collectionId;

    var _updateCollection = function(newBackendCollectionObject) {
      $scope.collection = CollectionObjectFactory.create(
        newBackendCollectionObject);
      $scope.collectionSkillList.setSkills(newBackendCollectionObject.skills);

      $scope.$broadcast('collectionLoaded');
    };

    // Load the collection to be edited.
    WritableCollectionBackendApiService.fetchWritableCollection(
      _collectionId).then(
        _updateCollection, function(error) {
          alertsService.addWarning(
            error || 'There was an error when loading the collection.');
        });

    // To be used after mutating the prerequisite and/or acquired skill lists.
    $scope.updateSkillList = function() {
      $scope.collectionSkillList.clearSkills();
      $scope.collectionSkillList.addSkillsFromSkillList(
        $scope.collection.getSkillList());
      $scope.collectionSkillList.sortSkills();
    };
  }
]);
