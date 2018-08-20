#!/usr/bin/env bash

oldVersion="/Users/peter/GETH_MASTER"
newVersion="/Users/peter/GETH_NEW"

#Old version	155Block	Head	ChainID		155Block	ChainID	Succeed

test1=("${oldVersion}" 20 15 1 20 1 0)
test2=("${oldVersion}" 20 15 1 20 10 0)
test3=("${oldVersion}" 20 10 1 15 1 0)
test4=("${oldVersion}" 20 10 1 25 1 0)
test5=("${oldVersion}" 20 10 1 15 10 0)
test6=("${oldVersion}" 20 10 1 25 10 0)
test7=("${oldVersion}" 20 15 1 10 1 0)
test8=("${oldVersion}" 20 15 1 10 10 0)

test9=("${newVersion}" 20 15 5 20 5 0)
test10=("${newVersion}" 20 15 5 20 10 0)
test11=("${newVersion}" 20 10 5 15 5 0)
test12=("${newVersion}" 20 10 5 25 5 0)
test13=("${newVersion}" 20 10 5 15 10 0)
test14=("${newVersion}" 20 10 5 25 10 0)
test15=("${newVersion}" 20 15 5 10 5 0)
test16=("${newVersion}" 20 15 5 10 10 0)

test17=("${oldVersion}" 20 30 1 25 1 0)
test18=("${oldVersion}" 20 30 1 20 10 0)
test19=("${oldVersion}" 20 30 1 15 1 0)
test20=("${oldVersion}" 20 30 1 25 1 0)
test21=("${oldVersion}" 20 30 1 15 10 0)
test22=("${oldVersion}" 20 30 1 25 10 0)
test23=("${oldVersion}" 20 30 1 10 1 0)
test24=("${oldVersion}" 20 30 1 10 10 0)
test25=("${oldVersion}" 20 30 1 40 1 0)
test26=("${oldVersion}" 20 30 1 40 10 0)

test27=("${newVersion}" 20 30 5 20 5 0)
test28=("${newVersion}" 20 30 5 20 10 1)
test29=("${newVersion}" 20 30 5 15 5 1)
test30=("${newVersion}" 20 30 5 25 5 1)
test31=("${newVersion}" 20 30 5 15 10 1)
test32=("${newVersion}" 20 30 5 25 10 1)
test33=("${newVersion}" 20 30 5 10 5 1)
test34=("${newVersion}" 20 30 5 10 10 1)
test35=("${newVersion}" 20 30 5 40 5 1)
test36=("${newVersion}" 20 30 5 40 10 1)


#bash test-single.sh "/Users/peter/GETH_MASTER" 20 15 1 20 1 0
for i in {1..36}
do
    echo "Running test ${i}"

    name1="test${i}[0]"
    name2="test${i}[1]"
    name3="test${i}[2]"
    name4="test${i}[3]"
    name5="test${i}[4]"
    name6="test${i}[5]"
    name7="test${i}[6]"

    ./test-single.sh ${!name1} ${!name2} ${!name3} ${!name4} ${!name5} ${!name6} ${!name7} > /dev/null

    resultArray[${i}]=$?
done

for i in {1..36}
do
    if [ ${resultArray[$i]} -ne 0 ];
    then
        echo "Test ${i} failed"

    else
        echo "Test ${i} succeeded"
    fi
done