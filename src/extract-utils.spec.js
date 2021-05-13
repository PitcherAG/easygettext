const {findTextEntriesInXmlExpression} = require('./extract-utils.js');

describe('Extract utils', () => {
  describe('XML template expression text extractor', () => {
    it('should identify text correctly for dynamic expressions', () => {
      expect(
        findTextEntriesInXmlExpression(
          "{{ coaching.PCH__User__r.Name }} {{ coaching.PCH__Execution_Date__c ? \'- \'+DATE(coaching.PCH__Execution_Date__c) :\'\'}}",
        ),
      ).toEqual([]);

      expect(
        findTextEntriesInXmlExpression(
          "{{ currentUser.Last_Execution_Date__c ? 'Last Coaching '+ DATE(currentUser.Last_Execution_Date__c) : 'No Coaching yet.'}}",
        ),
      ).toEqual(['Last Coaching ', 'No Coaching yet.']);

      expect(
        findTextEntriesInXmlExpression(
          '{{ currentUser.Last_Execution_Date__c ? `Last Coaching `+ DATE(currentUser.Last_Execution_Date__c) : `No Coaching yet.`}}',
        ),
      ).toEqual(['Last Coaching ', 'No Coaching yet.']);

      expect(
        findTextEntriesInXmlExpression(
          '{{ currentUser.Last_Execution_Date__c ? "Last Coaching "+ DATE(currentUser.Last_Execution_Date__c) : "No Coaching yet."}}',
        ),
      ).toEqual(['Last Coaching ', 'No Coaching yet.']);
    });
  });
});
