//total count
module.exports.count=(data)=>{
    return `SELECT store_id,
    count(temp_id||store_date||store_id) AS total_footfall_count
FROM customer_time_metrics
WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
AND store_id in ('${data.storeId}')
AND temp_id!=0
AND composite_inserted_at in
 (SELECT max(composite_inserted_at)
  FROM customer_time_metrics
  WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
    AND store_id in ('${data.storeId}')
  GROUP BY store_date,
           store_id)
GROUP BY store_id`.normalize()
}

//list of zone
module.exports.zone=(data)=>{
    return `SELECT store_id,
    split_part(zone_name, '_', 1) AS zone_name,
    split_part(zone_name, '_', 2) AS stream_id,
    count(DISTINCT tempid) AS zone_footfall_count
FROM
(SELECT store_id,
       tempid,
       split_part(zones, '|', 1) AS zone_name,
       split_part(zones, '|', 2) AS zone_time_spent
FROM
  (WITH RC AS
     (SELECT 1 AS split_index
      UNION ALL SELECT 2
      UNION ALL SELECT 3
      UNION ALL SELECT 4
      UNION ALL SELECT 5
      UNION ALL SELECT 6
      UNION ALL SELECT 7
      UNION ALL SELECT 8
      UNION ALL SELECT 9
      UNION ALL SELECT 10
      UNION ALL SELECT 11
      UNION ALL SELECT 12
      UNION ALL SELECT 13
      UNION ALL SELECT 14
      UNION ALL SELECT 15
      UNION ALL SELECT 16
      UNION ALL SELECT 17
      UNION ALL SELECT 18
      UNION ALL SELECT 19
      UNION ALL SELECT 20
      UNION ALL SELECT 21
      UNION ALL SELECT 22
      UNION ALL SELECT 23
      UNION ALL SELECT 24
      UNION ALL SELECT 25
      UNION ALL SELECT 26
      UNION ALL SELECT 27
      UNION ALL SELECT 28
      UNION ALL SELECT 29
      UNION ALL SELECT 30
      UNION ALL SELECT 31
      UNION ALL SELECT 32
      UNION ALL SELECT 33
      UNION ALL SELECT 34
      UNION ALL SELECT 35
      UNION ALL SELECT 36
      UNION ALL SELECT 37
      UNION ALL SELECT 38
      UNION ALL SELECT 39
      UNION ALL SELECT 40
      UNION ALL SELECT 41
      UNION ALL SELECT 42
      UNION ALL SELECT 43
      UNION ALL SELECT 44
      UNION ALL SELECT 45
      UNION ALL SELECT 46
      UNION ALL SELECT 47
      UNION ALL SELECT 48
      UNION ALL SELECT 49
      UNION ALL SELECT 50
      UNION ALL SELECT 51
      UNION ALL SELECT 52
      UNION ALL SELECT 53
      UNION ALL SELECT 54
      UNION ALL SELECT 55
      UNION ALL SELECT 56
      UNION ALL SELECT 57
      UNION ALL SELECT 58
      UNION ALL SELECT 59
      UNION ALL SELECT 60
      UNION ALL SELECT 61
      UNION ALL SELECT 62
      UNION ALL SELECT 63
      UNION ALL SELECT 64
      UNION ALL SELECT 65
      UNION ALL SELECT 66
      UNION ALL SELECT 67
      UNION ALL SELECT 68
      UNION ALL SELECT 69
      UNION ALL SELECT 70
      UNION ALL SELECT 71
      UNION ALL SELECT 72
      UNION ALL SELECT 73
      UNION ALL SELECT 74
      UNION ALL SELECT 75
      UNION ALL SELECT 76
      UNION ALL SELECT 77
      UNION ALL SELECT 78
      UNION ALL SELECT 79
      UNION ALL SELECT 80
      UNION ALL SELECT 81
      UNION ALL SELECT 82
      UNION ALL SELECT 83
      UNION ALL SELECT 84
      UNION ALL SELECT 85
      UNION ALL SELECT 86
      UNION ALL SELECT 87
      UNION ALL SELECT 88
      UNION ALL SELECT 89
      UNION ALL SELECT 90
      UNION ALL SELECT 91
      UNION ALL SELECT 92
      UNION ALL SELECT 93
      UNION ALL SELECT 94
      UNION ALL SELECT 95
      UNION ALL SELECT 96
      UNION ALL SELECT 97
      UNION ALL SELECT 98
      UNION ALL SELECT 99
      UNION ALL SELECT 100) SELECT store_id,
                                   tempid,
                                   TRIM(SPLIT_PART(B.zone_details, ',', RC.split_index)) AS zones
   FROM RC
   INNER JOIN
     (SELECT store_id,
             temp_id||store_date||store_id AS tempid,
             zone_details
      FROM customer_time_metrics
      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
        AND store_id in ('${data.storeId}')
        AND temp_id!=0
        AND composite_inserted_at in
          (SELECT max(composite_inserted_at)
           FROM customer_time_metrics
           WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
             AND store_id in ('${data.storeId}')
           GROUP BY store_date,
                    store_id))AS B ON RC.split_index <= REGEXP_COUNT(B.zone_details, ',') + 1))
WHERE zone_name !=''
GROUP BY store_id,
      zone_name
ORDER BY store_id,
      zone_footfall_count DESC`.normalize()
}

//zone details
module.exports.details=(data)=>{
    return `
    SELECT store_id,
           split_part(zones_name, '_', 1) AS zone_name,
           split_part(zones_name, '_', 2) AS stream_id,
           footfall,
           group_count,
           male_count,
           female_count,
           CASE
               WHEN avg_age>=1
                    AND avg_age<=12 THEN '1-12'
               WHEN avg_age>=13
                    AND avg_age<=19 THEN '13-19'
               WHEN avg_age>=20
                    AND avg_age<=30 THEN '20-30'
               WHEN avg_age>=31
                    AND avg_age<=45 THEN '31-45'
               WHEN avg_age>=46
                    AND avg_age<=59 THEN '46-59'
               WHEN avg_age>=60 THEN '60_above'
               ELSE 'NA'
           END AS avg_age_range,
           avg_zone_time_spent AS avg_dwell_time
    FROM
      (SELECT store_id,
              split_part(zones, '|', 1) AS zones_name,
              count(DISTINCT tempid) AS footfall,
              avg(age) AS avg_age,
              avg(split_part(zones, '|', 2)) AS avg_zone_time_spent,
              sum(male_count) AS male_count,
              sum(female_count) AS female_count,
              count(DISTINCT group_id||store_date||store_id) AS group_count
       FROM
         (WITH RC AS
            (SELECT 1 AS split_index
             UNION ALL SELECT 2
             UNION ALL SELECT 3
             UNION ALL SELECT 4
             UNION ALL SELECT 5
             UNION ALL SELECT 6
             UNION ALL SELECT 7
             UNION ALL SELECT 8
             UNION ALL SELECT 9
             UNION ALL SELECT 10
             UNION ALL SELECT 11
             UNION ALL SELECT 12
             UNION ALL SELECT 13
             UNION ALL SELECT 14
             UNION ALL SELECT 15
             UNION ALL SELECT 16
             UNION ALL SELECT 17
             UNION ALL SELECT 18
             UNION ALL SELECT 19
             UNION ALL SELECT 20
             UNION ALL SELECT 21
             UNION ALL SELECT 22
             UNION ALL SELECT 23
             UNION ALL SELECT 24
             UNION ALL SELECT 25
             UNION ALL SELECT 26
             UNION ALL SELECT 27
             UNION ALL SELECT 28
             UNION ALL SELECT 29
             UNION ALL SELECT 30
             UNION ALL SELECT 31
             UNION ALL SELECT 32
             UNION ALL SELECT 33
             UNION ALL SELECT 34
             UNION ALL SELECT 35
             UNION ALL SELECT 36
             UNION ALL SELECT 37
             UNION ALL SELECT 38
             UNION ALL SELECT 39
             UNION ALL SELECT 40
             UNION ALL SELECT 41
             UNION ALL SELECT 42
             UNION ALL SELECT 43
             UNION ALL SELECT 44
             UNION ALL SELECT 45
             UNION ALL SELECT 46
             UNION ALL SELECT 47
             UNION ALL SELECT 48
             UNION ALL SELECT 49
             UNION ALL SELECT 50
             UNION ALL SELECT 51
             UNION ALL SELECT 52
             UNION ALL SELECT 53
             UNION ALL SELECT 54
             UNION ALL SELECT 55
             UNION ALL SELECT 56
             UNION ALL SELECT 57
             UNION ALL SELECT 58
             UNION ALL SELECT 59
             UNION ALL SELECT 60
             UNION ALL SELECT 61
             UNION ALL SELECT 62
             UNION ALL SELECT 63
             UNION ALL SELECT 64
             UNION ALL SELECT 65
             UNION ALL SELECT 66
             UNION ALL SELECT 67
             UNION ALL SELECT 68
             UNION ALL SELECT 69
             UNION ALL SELECT 70
             UNION ALL SELECT 71
             UNION ALL SELECT 72
             UNION ALL SELECT 73
             UNION ALL SELECT 74
             UNION ALL SELECT 75
             UNION ALL SELECT 76
             UNION ALL SELECT 77
             UNION ALL SELECT 78
             UNION ALL SELECT 79
             UNION ALL SELECT 80
             UNION ALL SELECT 81
             UNION ALL SELECT 82
             UNION ALL SELECT 83
             UNION ALL SELECT 84
             UNION ALL SELECT 85
             UNION ALL SELECT 86
             UNION ALL SELECT 87
             UNION ALL SELECT 88
             UNION ALL SELECT 89
             UNION ALL SELECT 90
             UNION ALL SELECT 91
             UNION ALL SELECT 92
             UNION ALL SELECT 93
             UNION ALL SELECT 94
             UNION ALL SELECT 95
             UNION ALL SELECT 96
             UNION ALL SELECT 97
             UNION ALL SELECT 98
             UNION ALL SELECT 99
             UNION ALL SELECT 100) SELECT store_date,
                                          store_id,
                                          tempid,
                                          TRIM(SPLIT_PART(B.zone_details, ',', RC.split_index)) AS zones,
                                          age,
                                          male_count,
                                          female_count,
                                          group_id
          FROM RC
          INNER JOIN
            (SELECT t1.store_date,
                    t1.store_id,
                    t1.tempid,
                    zone_details,
                    age,
                    male_count,
                    female_count,
                    group_id
             FROM (
                     (SELECT store_date,
                             store_id,
                             temp_id||store_date||store_id AS tempid,
                             zone_details,
                             group_id
                      FROM customer_time_metrics
                      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                        AND store_id in ('${data.storeId}')
                        AND temp_id!=0
                        AND composite_inserted_at in
                          (SELECT max(composite_inserted_at)
                           FROM customer_time_metrics
                           WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                             AND store_id in ('${data.storeId}')
                           GROUP BY store_date,
                                    store_id)) AS t1
                   INNER JOIN
                     (SELECT temp_id||store_date||store_id AS tempid,
                             age,
                             male_count,
                             female_count
                      FROM customer_demographics
                      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                        AND store_id in ('${data.storeId}')) AS t2 ON t1.tempid=t2.tempid))AS B ON RC.split_index <= REGEXP_COUNT(B.zone_details, ',') + 1)
       WHERE zones_name !=''
       GROUP BY store_id,
                zones_name)
    WHERE zone_name in ('${data.zone_name}')`.normalize()
}