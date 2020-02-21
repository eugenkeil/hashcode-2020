"use strict";

function parseData () {
    var time = Date.now();
    var params = parseInput();

    // change function to appropriate one for given dataset
    var data = solveE(params.case, params.values, params.L, params.D, params.B);
    var solution = data.L + '\n';
    for(var n = 0; n < data.L; n++ ) {
        var library = data.libs[n];
        solution += library.id + ' ' + library.K + '\n' + library.books.join(" ") + '\n';
    }
    document.getElementById('ausgabe').value = solution;
    document.getElementById('time').innerHTML = Date.now()-time +' ms';
}

// Doesn't work well for E due to low number of days!
function solve(libs, values, L, D, B){
    var solution = {};

    // Sort books by value
    for (var n = 0; n < L; n++) {
      libs[n].books.sort((a,b) => {
        return values[b] - values[a];
      });
    }

    var books = {};
    for (var n = 0; n < B; n++) {
      books[n] = true;
    };
    libs.sort((a,b) => b.meta[0]/b.meta[1] - a.meta[0]/a.meta[1]);
    var t = D;
    solution.libs = libs.map(l => {
      var goodBooks = l.books.filter(b => books[b]);
      var usedBooks = goodBooks.slice(0,t * l.meta[2]);
      t -= l.meta[1];
      usedBooks.forEach(b => books[b] = false);
      return {id: l.id, K: goodBooks.length, books: goodBooks}});

    solution.L = solution.libs.length;
    console.log("Number of libs: " + solution.L);
    return solution;
}

// Also used for C
function solveB(libs, values, L, D, B){
    var solution = {};
    solution.L = L;
    libs.sort((a,b) => b.meta[0]/b.meta[1] - a.meta[0]/a.meta[1]);
    solution.libs = libs.map(l => {
      l.books.sort((a,b) => {
        return values[b] - values[a];
      });
      return {id: l.id, K: l.books.length, books: l.books}});
    return solution;
}

function solveE(libs, values, L, D, B){
    var solution = {};

    // Sort books by value
    for (var n = 0; n < L; n++) {
      libs[n].books.sort((a,b) => {
        return values[b] - values[a];
      });
    }

    for (var n = 0; n < libs.length; n++) {
      var sum = 0;
      for(var k = 0;k < Math.min(400,libs[n].books.length); k++) {
          sum += values[libs[n].books[k]];
      }
      var average = 0;
      for(var k = 0;k < libs[n].books.length; k++) {
          average += values[libs[n].books[k]];
      }
      libs[n].top200 = sum; // Math.min(libs[n].meta[2]*200,libs[n].books.length);
      libs[n].average = average / libs[n].books.length; // not used right now
    }

    // Heuristik
    libs.sort((a,b) => b.top200*b.meta[2]/b.meta[1] - a.top200*a.meta[2]/a.meta[1]);

    var books = {};
    for (var n = 0; n < B; n++) {
      books[n] = true;
    };

    var t = D;
    for (var n = 0; n < L; n++) {
        libs[n].books = libs[n].books.filter(b => books[b]);
        var usedBooks = libs[n].books.slice(0,t * libs[n].meta[2]);
        t -= libs[n].meta[1];
        usedBooks.forEach(b => books[b] = false);
    }

    solution.libs = libs.filter(l => l.books.length > 0).map(l => {return {id: l.id, K: l.books.length, books: l.books}});
    solution.L = solution.libs.length;
    return solution;
}

// Add libraries with many new books!
function solveD(libs, values, L, D, B){
    console.log("L: " + L + " D: " + D + " B: " + B);
    var solution = {};
    libs.sort((a,b) => b.meta[0] - a.meta[0]); // The more books the better
    var books = {};
    for (var n = 0; n < B; n++) {
      books[n] = true;
    };
    console.log("Number of books" + Object.keys(books).length);
    solution.libs = [];
    for (var n = 0; n < L; n++) {
        var newbooks = libs[n].books.filter(b => books[b]);
        if(newbooks.length > 0) {
          solution.libs.push({id: libs[n].id, K: newbooks.length, books: newbooks});
        }
        for (var b = 0; b < newbooks.length; b++) {
          books[newbooks[b]] = false;
        }
    }
    solution.libs.sort((a,b) => b.books.length - a.books.length); // The more books the better
    solution.L = solution.libs.length;
    console.log("Number of libs: " + solution.L);
    return solution;
}
