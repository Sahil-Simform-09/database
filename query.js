// find number of male and females, average age of both male and females whos age is grater than 50
db.person.aggregate([
    {$match: {"dob.age": {$gt: 50}}},
    {$group: {_id: 
        {gender: "$gender"}, numofPerons: {$sum: 1, avgAge: {$avg: "$dob.age"}}}}
])

// print fullname
db.person.aggregate([
    {
        $project: {
            _id: 0,
            gender: 1,
            fullName: {
                $concat: [
                    {$toUpper: {$substrCP: ['$name.first', 0, 1]}}, 
                    {$substrCP: ['$name.first', 1, {$strLenCP: '$name.first'}]},
                    ' ',
                    {$toUpper: {$substrCP: ['$name.last', 0, 1]}}, 
                    {$substrCP: ['$name.last', 1, {$strLenCP: '$name.last'}]} 
                ]
            }
        }
    }
])

// cretae geo-json object from latitude and longitude
db.person.aggregate([
    {
        $project: {
            _id: 0,
            fullName: {
                $concat: [
                    {
                        $toUpper: 
                        {
                            $substrCP: ['$name.first', 0, 1]
                        }
                    }, 
                    {
                        $substrCP: ['$name.first', 1, {
                            $strLenCP: '$name.first'
                        }]
                    },
                    ' ',
                    {
                        $toUpper: {
                            $substrCP: ['$name.last', 0, 1]
                        }
                    }, 
                    {
                        $substrCP: ['$name.last', 1, {
                            $strLenCP: '$name.last'
                        }]
                        } 
                ]
            }, 
            email: 1,
            location: {
                type: 'point',
                coordinates: [
                    {
                        $convert: {
                            input: '$location.coordinates.longitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0
                        }
                    },
                    {
                        $convert: {
                            input: '$location.coordinates.latitude',
                            to: 'double',
                            onError: 0.0,
                            onNull: 0.0
                        }
                    }
                ] 
            }
        }
    }
])

// get date and age field as top level field
db.person.aggregate([
    {
        $project: {
            _id: 0,
            email: 1,
            dob: {
                $convert: {
                    input: '$dob.date',
                    to: 'date',
                    onError: 0.0,
                    onNull: 0.0
                }
            },
            age: '$dob.age'
        }
    }
])
// instead 
db.person.aggregate([
    {
        $project: {
            _id: 0,
            email: 1,
            dob: {$toDate: '$dob.date'},
            age: '$dob.age'
        }
    }
])

// group person by birth year
db.person.aggregate([
    {
        $project: {
            _id: 0,
            email: 1,
            birthdate: {
                $convert: {
                    input: '$dob.date',
                    to: 'date',
                    onError: 0.0,
                    onNull: 0.0
                }
            },
            age: '$dob.age'
        }
    },
    {
        $group: {
            _id: {
                birthYear: {$isoWeekYear: '$birthdate'}
            }, 
            numofPerons: {$sum: 1}
        }
    }
])

// group by age
db.friends.aggregate([
    {
        $group: {
            _id: {
                age: '$age',
            },
            numOfFriends: {
                $sum: 1
            }, 
            allHobbiesForThisAge: {
                $push: '$hobbies'
            }
        }
    }
])
// use unwind
db.friends.aggregate([
    {
        $unwind: '$hobbies'
    },
    {
        $group: {
            _id: {
                age: '$age',
            },
            numOfFriends: {
                $sum: 1
            }, 
            allHobbiesForThisAge: {
                $push: '$hobbies'
            }
        }
    }
])
// use addToSet
db.friends.aggregate([
    {
        $unwind: '$hobbies'
    },
    {
        $group: {
            _id: {
                age: '$age',
            },
            numOfFriends: {
                $sum: 1
            }, 
            allHobbiesForThisAge: {
                $addToSet: '$hobbies'
            }
        }
    }
])

// score grater than 60
db.friends.aggregate([
    {
        $project: {
            name: 1,
            examScores: {
                $filter: {
                    input: '$examScores',
                    as: 'sc',
                    cond: {
                        $gt: ['$$sc.score', 60]
                    }
                }
            }
        }
    }
])

// max score for all freinds
db.friends.aggregate([
    {
        $unwind: '$examScores'
    }, 
    {
        $group: {
            _id: {
                stuName: '$name'
            }, 
            maxScore: {
                $max: '$examScores.score'
            }
        }
    }
])

//create bucket
db.person.aggregate([
    {
        $bucketAuto: {
            groupBy: '$dob.age', 
            buckets: 5,
            output: {
                numOfPersons: {
                    $sum: 1
                }
            }
        }
    }
])