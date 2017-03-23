module.exports = function(userQuery, title) {
                        let matrix = [];

                        // increment along the first column of each row
                        let i;
                        for (i = 0; i <= title.length; i++) {
                            matrix[i] = [i];
                        }

                        // increment each column in the first row
                        let j;
                        for (j = 0; j <= userQuery.length; j++) {
                            matrix[0][j] = j;
                        }

                        // Fill in the rest of the matrix
                        for (i = 1; i <= title.length; i++) {
                            for (j = 1; j <= userQuery.length; j++) {
                                if (title.charAt(i - 1) == userQuery.charAt(j - 1)) {
                                    matrix[i][j] = matrix[i - 1][j - 1];
                                } else {
                                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                            Math.min(matrix[i][j - 1] + 1, // insertion
                                            matrix[i - 1][j] + 1)); // deletion
                                }
                            }
                        }

                        console.log("difference is" + matrix[title.length][userQuery.length]);
                        return matrix[title.length][userQuery.length];
}
