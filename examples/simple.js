/**
 * Get a list of full names
 * @param  {Object[]} people            2d array of people
 * @param  {string} people[].firstName  First name of a person
 * @param  {string} people[].lastName   Last name of a person
 * @return {string[]}                   List of full names
 */
module.exports.getFullNames = function getFullNames(people) {
  return people.map(function(person) {
    return person.firstName + ' ' + person.lastName;
  });
}
