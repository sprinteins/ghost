using "it.only" instead of it for your test lets you run only marked tests

For the non UI tests we're using mocked data from a string and an array. Those require some specific formatting rules to meet the gitlog style. 

newFileMap in formatting.js is beeing exported so we can access the formatted result
<b>For the formatting.js input String:</b>
    'Wed, 6 Feb 2019 10:15:28 +0100\n\n3	1	Bugfix_2.txt\nWed, 6 Feb 2019 10:04:11 +0100\n\n5	0	Bugfix_2.txt\nWed, 6 Feb 2019 10:00:42 +0100\n\n3	1	Bugfix_1.txt' 

    Formatting: 
    In each commit the first input is the date ("3 digit day," "space" "day number" "space" "3 digit month" "space" "year" "space" "hours:minutes:seconds" "space""time difference to greenwich"), after that an empty line (two linebreaks) and then the commit data("additions" "tab" "deletions" "tab" "filename").
    If there is a commit following, one linebreak follows the filename. 

<b>For the calculations.js input array:</b>
    [{ file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:15:28', stats: [3, 1, 'Bugfix_2.txt'] },
      { file: 'Bugfix_2.txt', latestDate: '2019-02-06 T10:04:11', stats: [5, 0, 'Bugfix_2.txt'] },
      { file: 'Bugfix_1.txt', latestDate: '2019-02-06 T10:00:42', stats: [3, 1, 'Bugfix_1.txt'] }]
    
    Formatting: 
    the array is made out of objects, each object contains "file: "space" 'filename'," "space" "latestDate:" "space" "'yyyy-mm-dd Thh:mm:ss'," "space" "stats:" "space:" "[additions," "space" "deletions," "space" "filename]"
