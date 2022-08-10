

// conversion metrics
module.exports.templateA =(data) =>{
 return `SELECT t1.store_id,
 substring(t1.store_date, 1, 10) AS date,
 footfall_count,
 bounced_footfall_count,
 group_count,
 engagers_count,
 CASE
     WHEN missed_opportunity_type='engagers-conversion' THEN
            (SELECT missed_opportunity_count_ec)
     ELSE
            (SELECT missed_opportunity_count_gc)
 END AS missed_opportunity_count,
 conversion_count,
 avg_time_spent,
 infra_downtime_minutes
FROM(
 (SELECT store_id,
         store_date,
         count(temp_id||store_date||store_id) AS footfall_count,
         count(DISTINCT group_id||store_date||store_id) AS group_count,
         SUM(CASE
                 WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
                 ELSE 0
             END) AS bounced_footfall_count,
         SUM (CASE
                  WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
                  ELSE 0
              END) AS engagers_count,
             SUM(CASE
                     WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                     ELSE 0
                 END) AS conversion_count,
             AVG(time_spent) AS avg_time_spent,
             engagers_count-conversion_count AS missed_opportunity_count_ec,
             group_count-conversion_count AS missed_opportunity_count_gc,
             '${data.query.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
  FROM customer_time_metrics
  WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
    AND store_id in (${data.storeId})
    AND temp_id!=0
    AND composite_inserted_at in
      (SELECT max(composite_inserted_at)
       FROM customer_time_metrics
       WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
         AND store_id in (${data.storeId})
       GROUP BY store_date,
                store_id)
  GROUP BY store_date,
           store_id) AS t1
INNER JOIN
 (SELECT store_id,
         store_date,
         sum(downtime) AS infra_downtime_minutes
  FROM camera_operation_metrics
  WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
    AND store_id in (${data.storeId})
  GROUP BY store_date,
           store_id) AS t2 ON t1.store_date=t2.store_date
AND t1.store_id=t2.store_id)
ORDER BY store_id,date ${data.limit_query}`.normalize();
}

//conversion metrics count
module.exports.templateACount = (data) => {
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT t1.store_id,
            substring(t1.store_date, 1, 10) AS date,
            footfall_count,
            bounced_footfall_count,
            group_count,
            engagers_count,
            CASE
                WHEN missed_opportunity_type='engagers-conversion' THEN
                       (SELECT missed_opportunity_count_ec)
                ELSE
                       (SELECT missed_opportunity_count_gc)
            END AS missed_opportunity_count,
            conversion_count,
            avg_time_spent,
            infra_downtime_minutes
     FROM(
            (SELECT store_id,
                    store_date,
                    count(temp_id||store_date||store_id) AS footfall_count,
                    count(DISTINCT group_id||store_date||store_id) AS group_count,
                    SUM(CASE
                            WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
                            ELSE 0
                        END) AS bounced_footfall_count,
                    SUM (CASE
                             WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
                             ELSE 0
                         END) AS engagers_count,
                        SUM(CASE
                                WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                                ELSE 0
                            END) AS conversion_count,
                        AVG(time_spent) AS avg_time_spent,
                        engagers_count-conversion_count AS missed_opportunity_count_ec,
                        group_count-conversion_count AS missed_opportunity_count_gc,
                        '${data.query.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
             FROM customer_time_metrics
             WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
               AND store_id in (${data.storeId})
               AND temp_id!=0
               AND composite_inserted_at in
                 (SELECT max(composite_inserted_at)
                  FROM customer_time_metrics
                  WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                    AND store_id in (${data.storeId})
                  GROUP BY store_date,
                           store_id)
             GROUP BY store_date,
                      store_id) AS t1
          INNER JOIN
            (SELECT store_id,
                    store_date,
                    sum(downtime) AS infra_downtime_minutes
             FROM camera_operation_metrics
             WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
               AND store_id in (${data.storeId})
             GROUP BY store_date,
                      store_id) AS t2 ON t1.store_date=t2.store_date
          AND t1.store_id=t2.store_id)
     ORDER BY store_id,date)`.normalize();
}

// group metrics
module.exports.templateB =(data) =>{
     return `SELECT store_id,
     substring(date,1, 10) AS date,
     sum(group_head_count) AS footfall,
     count(group_head_count) AS group_count,
     avg(group_head_count) AS avg_head_count,
     sum("1-12") AS "age_1-12",
     sum("13-19") AS "age_13-19",
     sum("20-30") AS "age_20-30",
     sum("31-45") AS "age_31-45",
     sum("46-59") AS "age_46-59",
     sum("60+") AS "age_60_above",
     sum(male_count) AS male_count,
     sum(female_count) AS female_count
FROM
(SELECT store_id,
        store_date AS date,
        count(t1.tempid) AS group_head_count,
        sum("1-12") AS "1-12",
        sum("13-19") AS "13-19",
        sum("20-30") AS "20-30",
        sum("31-45") AS "31-45",
        sum("46-59") AS "46-59",
        sum("60+") AS "60+",
        sum(male_count) AS male_count,
        sum(female_count) AS female_count
 FROM(
        (SELECT store_date,
                store_id,
                temp_id||store_date||store_id AS tempid,
                sum(CASE
                        WHEN age>=1
                             AND age<=12 THEN 1
                        ELSE 0
                    END) AS "1-12",
                sum(CASE
                        WHEN age>=13
                             AND age<=19 THEN 1
                        ELSE 0
                    END) AS "13-19",
                sum(CASE
                        WHEN age>=20
                             AND age<=30 THEN 1
                        ELSE 0
                    END) AS "20-30",
                sum(CASE
                        WHEN age>=31
                             AND age<=45 THEN 1
                        ELSE 0
                    END) AS "31-45",
                sum(CASE
                        WHEN age>=46
                             AND age<=59 THEN 1
                        ELSE 0
                    END) AS "46-59",
                sum(CASE
                        WHEN age>=60 THEN 1
                        ELSE 0
                    END) AS "60+",
                sum(male_count) AS male_count,
                sum(female_count) AS female_count
         FROM customer_demographics
         WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
           AND store_id in (${data.storeId})
           AND temp_id!=0
         GROUP BY store_date,
                  store_id,
                  temp_id) AS t1
      INNER JOIN
        (SELECT group_id,
                temp_id||store_date||store_id AS tempid,
                entry_time,
                exit_time,
                time_spent
         FROM customer_time_metrics
         WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
           AND store_id in (${data.storeId})
           AND temp_id!=0
           AND composite_inserted_at in
             (SELECT max(composite_inserted_at)
              FROM customer_time_metrics
              WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                AND store_id in (${data.storeId})
              GROUP BY store_date,
                       store_id)) AS t2 ON t1.tempid=t2.tempid)
 GROUP BY store_id,
          store_date,
          group_id)
GROUP BY store_id,date
ORDER BY store_id,date
${data.limit_query}`.normalize();
}

// group metrics count
module.exports.templateBCount = (data) =>{
  return  `SELECT count(*) AS total_records_count
  FROM
    (SELECT store_id,
            substring(date,1, 10) AS date,
            sum(group_head_count) AS footfall,
            count(group_head_count) AS group_count,
            avg(group_head_count) AS avg_head_count,
            sum("1-12") AS "age_1-12",
            sum("13-19") AS "age_13-19",
            sum("20-30") AS "age_20-30",
            sum("31-45") AS "age_31-45",
            sum("46-59") AS "age_46-59",
            sum("60+") AS "age_60_above",
            sum(male_count) AS male_count,
            sum(female_count) AS female_count
     FROM
       (SELECT store_id,
               store_date AS date,
               count(t1.tempid) AS group_head_count,
               sum("1-12") AS "1-12",
               sum("13-19") AS "13-19",
               sum("20-30") AS "20-30",
               sum("31-45") AS "31-45",
               sum("46-59") AS "46-59",
               sum("60+") AS "60+",
               sum(male_count) AS male_count,
               sum(female_count) AS female_count
        FROM(
               (SELECT store_date,
                       store_id,
                       temp_id||store_date||store_id AS tempid,
                       sum(CASE
                               WHEN age>=1
                                    AND age<=12 THEN 1
                               ELSE 0
                           END) AS "1-12",
                       sum(CASE
                               WHEN age>=13
                                    AND age<=19 THEN 1
                               ELSE 0
                           END) AS "13-19",
                       sum(CASE
                               WHEN age>=20
                                    AND age<=30 THEN 1
                               ELSE 0
                           END) AS "20-30",
                       sum(CASE
                               WHEN age>=31
                                    AND age<=45 THEN 1
                               ELSE 0
                           END) AS "31-45",
                       sum(CASE
                               WHEN age>=46
                                    AND age<=59 THEN 1
                               ELSE 0
                           END) AS "46-59",
                       sum(CASE
                               WHEN age>=60 THEN 1
                               ELSE 0
                           END) AS "60+",
                       sum(male_count) AS male_count,
                       sum(female_count) AS female_count
                FROM customer_demographics
                WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                  AND store_id in (${data.storeId})
                  AND temp_id!=0
                GROUP BY store_date,
                         store_id,
                         temp_id) AS t1
             INNER JOIN
               (SELECT group_id,
                       temp_id||store_date||store_id AS tempid,
                       entry_time,
                       exit_time,
                       time_spent
                FROM customer_time_metrics
                WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                  AND store_id in (${data.storeId})
                  AND temp_id!=0
                  AND composite_inserted_at in
                    (SELECT max(composite_inserted_at)
                     FROM customer_time_metrics
                     WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                       AND store_id in (${data.storeId})
                     GROUP BY store_date,
                              store_id)) AS t2 ON t1.tempid=t2.tempid)
        GROUP BY store_id,
                 store_date,
                 group_id)
     GROUP BY store_id,date
     ORDER BY store_id,date)`.normalize();
}
// store operations
module.exports.templateC =(data) =>{
      return `SELECT p1.store_id,
      substring(cast(p1.store_date AS varchar), 1, 10) AS date,
      p1.downtime_hour_range AS time_range,
      opening_time,
      closing_time,
      operating_time,
      p1.infra_down_time_minutes
FROM ((
        (SELECT t2.store_id,
                downtime_hour_range,
                t2.store_date,
                opening_time,
                infra_down_time_minutes
         FROM(
                (SELECT store_id,
                        store_date,
                        CASE
                            WHEN substring(opening_time, 1, 2) in('06') THEN '6-7'
                            WHEN substring(opening_time, 1, 2) in('07') THEN '7-8'
                            WHEN substring(opening_time, 1, 2) in('08') THEN '8-9'
                            WHEN substring(opening_time, 1, 2) in('09') THEN '9-10'
                            WHEN substring(opening_time, 1, 2) in('10') THEN '10-11'
                            WHEN substring(opening_time, 1, 2) in('11') THEN '11-12'
                            WHEN substring(opening_time, 1, 2) in('12') THEN '12-13'
                            WHEN substring(opening_time, 1, 2) in('13') THEN '13-14'
                            WHEN substring(opening_time, 1, 2) in('14') THEN '14-15'
                            WHEN substring(opening_time, 1, 2) in('15') THEN '15-16'
                            WHEN substring(opening_time, 1, 2) in('16') THEN '16-17'
                            WHEN substring(opening_time, 1, 2) in('17') THEN '17-18'
                            WHEN substring(opening_time, 1, 2) in('18') THEN '18-19'
                            WHEN substring(opening_time, 1, 2) in('19') THEN '19-20'
                            WHEN substring(opening_time, 1, 2) in('20') THEN '20-21'
                            WHEN substring(opening_time, 1, 2) in('21') THEN '21-22'
                            WHEN substring(opening_time, 1, 2) in('22') THEN '22-23'
                            ELSE 'NOT IN 6-23'
                        END AS opening_hour_range,
                        substring(opening_time, 1, 5) AS opening_time
                 FROM store_operation_metrics
                 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                   AND store_id in (${data.storeId})
                   AND composite_inserted_at in
                     (SELECT max(composite_inserted_at)
                      FROM store_operation_metrics
                      WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                        AND store_id in (${data.storeId})
                      GROUP BY store_date,
                               store_id)) AS t1
              RIGHT JOIN
                (SELECT store_date,
                        store_id,
                        split_part(downtime_hour_range, '-', 1) AS HOUR,
                        downtime_hour_range,
                        sum(downtime) AS infra_down_time_minutes
                 FROM camera_operation_metrics
                 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                   AND store_id in (${data.storeId})
                 GROUP BY store_date,
                          store_id,
                          HOUR,
                          downtime_hour_range) AS t2 ON t1.store_date=t2.store_date
              AND t1.store_id=t2.store_id
              AND (t1.opening_hour_range)=t2.downtime_hour_range)
         ORDER BY t2.store_date) AS p1
      INNER JOIN
        (SELECT t2.store_id,
                downtime_hour_range,
                t2.store_date,
                closing_time,
                infra_down_time_minutes
         FROM(
                (SELECT store_id,
                        store_date,
                        CASE
                            WHEN substring(closing_time, 1, 2) in('06') THEN '6-7'
                            WHEN substring(closing_time, 1, 2) in('07') THEN '7-8'
                            WHEN substring(closing_time, 1, 2) in('08') THEN '8-9'
                            WHEN substring(closing_time, 1, 2) in('09') THEN '9-10'
                            WHEN substring(closing_time, 1, 2) in('10') THEN '10-11'
                            WHEN substring(closing_time, 1, 2) in('11') THEN '11-12'
                            WHEN substring(closing_time, 1, 2) in('12') THEN '12-13'
                            WHEN substring(closing_time, 1, 2) in('13') THEN '13-14'
                            WHEN substring(closing_time, 1, 2) in('14') THEN '14-15'
                            WHEN substring(closing_time, 1, 2) in('15') THEN '15-16'
                            WHEN substring(closing_time, 1, 2) in('16') THEN '16-17'
                            WHEN substring(closing_time, 1, 2) in('17') THEN '17-18'
                            WHEN substring(closing_time, 1, 2) in('18') THEN '18-19'
                            WHEN substring(closing_time, 1, 2) in('19') THEN '19-20'
                            WHEN substring(closing_time, 1, 2) in('20') THEN '20-21'
                            WHEN substring(closing_time, 1, 2) in('21') THEN '21-22'
                            WHEN substring(closing_time, 1, 2) in('22') THEN '22-23'
                            ELSE 'NOT IN 0-23'
                        END AS closing_hour_range,
                        substring(closing_time, 1, 5) AS closing_time
                 FROM store_operation_metrics
                 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                   AND store_id in (${data.storeId})
                   AND composite_inserted_at in
                     (SELECT max(composite_inserted_at)
                      FROM store_operation_metrics
                      WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                        AND store_id in (${data.storeId})
                      GROUP BY store_date,
                               store_id)) AS t1
              RIGHT JOIN
                (SELECT store_date,
                        store_id,
                        split_part(downtime_hour_range, '-', 1) AS HOUR,
                        downtime_hour_range,
                        sum(downtime) AS infra_down_time_minutes
                 FROM camera_operation_metrics
                 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                   AND store_id in (${data.storeId})
                 GROUP BY store_date,
                          store_id,
                          HOUR,
                          downtime_hour_range) AS t2 ON t1.store_date=t2.store_date
              AND t1.store_id=t2.store_id
              AND (t1.closing_hour_range)=t2.downtime_hour_range)
         ORDER BY t2.store_date) AS p2 ON p1.store_date=p2.store_date
      AND p1.store_id=p2.store_id
      AND p1.downtime_hour_range=p2.downtime_hour_range)
     INNER JOIN
       (SELECT t2.store_id,
               downtime_hour_range,
               t2.store_date,
               operating_time,
               infra_down_time_minutes
        FROM(
               (SELECT store_id,
                       store_date,
                       CASE
                           WHEN substring(operating_time, 1, 2) <='06' THEN '6-7'
                           WHEN substring(operating_time, 1, 2) ='07' THEN '7-8'
                           WHEN substring(operating_time, 1, 2) ='08' THEN '8-9'
                           WHEN substring(operating_time, 1, 2) ='09' THEN '9-10'
                           WHEN substring(operating_time, 1, 2) ='10' THEN '10-11'
                           WHEN substring(operating_time, 1, 2) ='11' THEN '11-12'
                           WHEN substring(operating_time, 1, 2) ='12' THEN '12-13'
                           WHEN substring(operating_time, 1, 2) ='13' THEN '13-14'
                           WHEN substring(operating_time, 1, 2) ='14' THEN '14-15'
                           WHEN substring(operating_time, 1, 2) ='15' THEN '15-16'
                           WHEN substring(operating_time, 1, 2) ='16' THEN '16-17'
                           WHEN substring(operating_time, 1, 2) ='17' THEN '17-18'
                           WHEN substring(operating_time, 1, 2) ='18' THEN '18-19'
                           WHEN substring(operating_time, 1, 2) ='19' THEN '19-20'
                           WHEN substring(operating_time, 1, 2) ='20' THEN '20-21'
                           WHEN substring(operating_time, 1, 2) ='21' THEN '21-22'
                           WHEN substring(operating_time, 1, 2) ='22' THEN '22-23'
                           ELSE 'NOT IN 0-23'
                       END AS operating_hour_range,
                       substring(operating_time, 1, 5) AS operating_time
                FROM store_operation_metrics
                WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                  AND store_id in (${data.storeId})
                  AND composite_inserted_at in
                    (SELECT max(composite_inserted_at)
                     FROM store_operation_metrics
                     WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                       AND store_id in (${data.storeId})
                     GROUP BY store_date,
                              store_id)) AS t1
             RIGHT JOIN
               (SELECT store_date,
                       store_id,
                       split_part(downtime_hour_range, '-', 1) AS HOUR,
                       downtime_hour_range,
                       sum(downtime) AS infra_down_time_minutes
                FROM camera_operation_metrics
                WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                  AND store_id in (${data.storeId})
                GROUP BY store_date,
                         store_id,
                         HOUR,
                         downtime_hour_range) AS t2 ON t1.store_date=t2.store_date
             AND t1.store_id=t2.store_id
             AND t1.operating_hour_range=t2.downtime_hour_range)
        ORDER BY t2.store_date) AS p3 ON p1.store_date=p3.store_date
     AND p1.store_id=p3.store_id
     AND p1.downtime_hour_range=p3.downtime_hour_range)
ORDER BY store_id,date,cast(split_part(p1.downtime_hour_range, '-', 1) AS integer) ASC
${data.limit_query}`.normalize();
}

// store operations count
module.exports.templateCCount = (data) =>{
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT p1.store_id,
            substring(cast(p1.store_date AS varchar), 1, 10) AS date,
            p1.downtime_hour_range AS time_range,
            opening_time,
            closing_time,
            operating_time,
            p1.infra_down_time_minutes
     FROM ((
              (SELECT t2.store_id,
                      downtime_hour_range,
                      t2.store_date,
                      opening_time,
                      infra_down_time_minutes
               FROM(
                      (SELECT store_id,
                              store_date,
                              CASE
                                  WHEN substring(opening_time, 1, 2) in('06') THEN '6-7'
                                  WHEN substring(opening_time, 1, 2) in('07') THEN '7-8'
                                  WHEN substring(opening_time, 1, 2) in('08') THEN '8-9'
                                  WHEN substring(opening_time, 1, 2) in('09') THEN '9-10'
                                  WHEN substring(opening_time, 1, 2) in('10') THEN '10-11'
                                  WHEN substring(opening_time, 1, 2) in('11') THEN '11-12'
                                  WHEN substring(opening_time, 1, 2) in('12') THEN '12-13'
                                  WHEN substring(opening_time, 1, 2) in('13') THEN '13-14'
                                  WHEN substring(opening_time, 1, 2) in('14') THEN '14-15'
                                  WHEN substring(opening_time, 1, 2) in('15') THEN '15-16'
                                  WHEN substring(opening_time, 1, 2) in('16') THEN '16-17'
                                  WHEN substring(opening_time, 1, 2) in('17') THEN '17-18'
                                  WHEN substring(opening_time, 1, 2) in('18') THEN '18-19'
                                  WHEN substring(opening_time, 1, 2) in('19') THEN '19-20'
                                  WHEN substring(opening_time, 1, 2) in('20') THEN '20-21'
                                  WHEN substring(opening_time, 1, 2) in('21') THEN '21-22'
                                  WHEN substring(opening_time, 1, 2) in('22') THEN '22-23'
                                  ELSE 'NOT IN 6-23'
                              END AS opening_hour_range,
                              substring(opening_time, 1, 5) AS opening_time
                       FROM store_operation_metrics
                       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                         AND store_id in (${data.storeId})
                         AND composite_inserted_at in
                           (SELECT max(composite_inserted_at)
                            FROM store_operation_metrics
                            WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                              AND store_id in (${data.storeId})
                            GROUP BY store_date,
                                     store_id)) AS t1
                    RIGHT JOIN
                      (SELECT store_date,
                              store_id,
                              split_part(downtime_hour_range, '-', 1) AS HOUR,
                              downtime_hour_range,
                              sum(downtime) AS infra_down_time_minutes
                       FROM camera_operation_metrics
                       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                         AND store_id in (${data.storeId})
                       GROUP BY store_date,
                                store_id,
                                HOUR,
                                downtime_hour_range) AS t2 ON t1.store_date=t2.store_date
                    AND t1.store_id=t2.store_id
                    AND (t1.opening_hour_range)=t2.downtime_hour_range)
               ORDER BY t2.store_date) AS p1
            INNER JOIN
              (SELECT t2.store_id,
                      downtime_hour_range,
                      t2.store_date,
                      closing_time,
                      infra_down_time_minutes
               FROM(
                      (SELECT store_id,
                              store_date,
                              CASE
                                  WHEN substring(closing_time, 1, 2) in('06') THEN '6-7'
                                  WHEN substring(closing_time, 1, 2) in('07') THEN '7-8'
                                  WHEN substring(closing_time, 1, 2) in('08') THEN '8-9'
                                  WHEN substring(closing_time, 1, 2) in('09') THEN '9-10'
                                  WHEN substring(closing_time, 1, 2) in('10') THEN '10-11'
                                  WHEN substring(closing_time, 1, 2) in('11') THEN '11-12'
                                  WHEN substring(closing_time, 1, 2) in('12') THEN '12-13'
                                  WHEN substring(closing_time, 1, 2) in('13') THEN '13-14'
                                  WHEN substring(closing_time, 1, 2) in('14') THEN '14-15'
                                  WHEN substring(closing_time, 1, 2) in('15') THEN '15-16'
                                  WHEN substring(closing_time, 1, 2) in('16') THEN '16-17'
                                  WHEN substring(closing_time, 1, 2) in('17') THEN '17-18'
                                  WHEN substring(closing_time, 1, 2) in('18') THEN '18-19'
                                  WHEN substring(closing_time, 1, 2) in('19') THEN '19-20'
                                  WHEN substring(closing_time, 1, 2) in('20') THEN '20-21'
                                  WHEN substring(closing_time, 1, 2) in('21') THEN '21-22'
                                  WHEN substring(closing_time, 1, 2) in('22') THEN '22-23'
                                  ELSE 'NOT IN 0-23'
                              END AS closing_hour_range,
                              substring(closing_time, 1, 5) AS closing_time
                       FROM store_operation_metrics
                       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                         AND store_id in (${data.storeId})
                         AND composite_inserted_at in
                           (SELECT max(composite_inserted_at)
                            FROM store_operation_metrics
                            WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                              AND store_id in (${data.storeId})
                            GROUP BY store_date,
                                     store_id)) AS t1
                    RIGHT JOIN
                      (SELECT store_date,
                              store_id,
                              split_part(downtime_hour_range, '-', 1) AS HOUR,
                              downtime_hour_range,
                              sum(downtime) AS infra_down_time_minutes
                       FROM camera_operation_metrics
                       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                         AND store_id in (${data.storeId})
                       GROUP BY store_date,
                                store_id,
                                HOUR,
                                downtime_hour_range) AS t2 ON t1.store_date=t2.store_date
                    AND t1.store_id=t2.store_id
                    AND (t1.closing_hour_range)=t2.downtime_hour_range)
               ORDER BY t2.store_date) AS p2 ON p1.store_date=p2.store_date
            AND p1.store_id=p2.store_id
            AND p1.downtime_hour_range=p2.downtime_hour_range)
           INNER JOIN
             (SELECT t2.store_id,
                     downtime_hour_range,
                     t2.store_date,
                     operating_time,
                     infra_down_time_minutes
              FROM(
                     (SELECT store_id,
                             store_date,
                             CASE
                                 WHEN substring(operating_time, 1, 2) <='06' THEN '6-7'
                                 WHEN substring(operating_time, 1, 2) ='07' THEN '7-8'
                                 WHEN substring(operating_time, 1, 2) ='08' THEN '8-9'
                                 WHEN substring(operating_time, 1, 2) ='09' THEN '9-10'
                                 WHEN substring(operating_time, 1, 2) ='10' THEN '10-11'
                                 WHEN substring(operating_time, 1, 2) ='11' THEN '11-12'
                                 WHEN substring(operating_time, 1, 2) ='12' THEN '12-13'
                                 WHEN substring(operating_time, 1, 2) ='13' THEN '13-14'
                                 WHEN substring(operating_time, 1, 2) ='14' THEN '14-15'
                                 WHEN substring(operating_time, 1, 2) ='15' THEN '15-16'
                                 WHEN substring(operating_time, 1, 2) ='16' THEN '16-17'
                                 WHEN substring(operating_time, 1, 2) ='17' THEN '17-18'
                                 WHEN substring(operating_time, 1, 2) ='18' THEN '18-19'
                                 WHEN substring(operating_time, 1, 2) ='19' THEN '19-20'
                                 WHEN substring(operating_time, 1, 2) ='20' THEN '20-21'
                                 WHEN substring(operating_time, 1, 2) ='21' THEN '21-22'
                                 WHEN substring(operating_time, 1, 2) ='22' THEN '22-23'
                                 ELSE 'NOT IN 0-23'
                             END AS operating_hour_range,
                             substring(operating_time, 1, 5) AS operating_time
                      FROM store_operation_metrics
                      WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                        AND store_id in (${data.storeId})
                        AND composite_inserted_at in
                          (SELECT max(composite_inserted_at)
                           FROM store_operation_metrics
                           WHERE store_date BETWEEN '${data.fromDate}' AND '${data.fromDate}'
                             AND store_id in (${data.storeId})
                           GROUP BY store_date,
                                    store_id)) AS t1
                   RIGHT JOIN
                     (SELECT store_date,
                             store_id,
                             split_part(downtime_hour_range, '-', 1) AS HOUR,
                             downtime_hour_range,
                             sum(downtime) AS infra_down_time_minutes
                      FROM camera_operation_metrics
                      WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                        AND store_id in (${data.storeId})
                      GROUP BY store_date,
                               store_id,
                               HOUR,
                               downtime_hour_range) AS t2 ON t1.store_date=t2.store_date
                   AND t1.store_id=t2.store_id
                   AND t1.operating_hour_range=t2.downtime_hour_range)
              ORDER BY t2.store_date) AS p3 ON p1.store_date=p3.store_date
           AND p1.store_id=p3.store_id
           AND p1.downtime_hour_range=p3.downtime_hour_range)
     ORDER BY store_id,date,cast(split_part(p1.downtime_hour_range, '-', 1) AS integer) ASC)`.normalize();
}

// overall metrics
module.exports.templateD = (data) =>{
  return `SELECT p1.store_id,
  substring(p1.store_date, 1, 10) AS date,
  footfall_count,
  group_count,
  avg_time_spent,
  conversion_count,
  bounced_footfall_count,
  CASE
      WHEN missed_opportunity_type='engagers-conversion' THEN
             (SELECT missed_opportunity_count_ec)
      ELSE
             (SELECT missed_opportunity_count_gc)
  END AS missed_opportunity_count,
  "age_1-12",
  "age_13-19",
  "age_20-30",
  "age_31-45",
  "age_46-59",
  "age_60_above",
  male_count,
  female_count,
  opening_time,
  closing_time,
  operating_time,
  infra_down_time_minutes
FROM ((
    (SELECT store_id,
            store_date,
            count(t1.tempid||store_date||store_id) AS footfall_count,
            count(DISTINCT group_id||store_date||store_id) AS group_count,
            AVG(time_spent) AS avg_time_spent,
            SUM(CASE
                    WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                    ELSE 0
                END) AS conversion_count,
            SUM(CASE
                    WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
                    ELSE 0
                END) AS bounced_footfall_count,
            SUM(CASE
                    WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
                    ELSE 0
                END) AS engagers_count,
            sum(CASE
                    WHEN age>=1
                         AND age<=12 THEN 1
                    ELSE 0
                END) AS "age_1-12",
            sum(CASE
                    WHEN age>=13
                         AND age<=19 THEN 1
                    ELSE 0
                END) AS "age_13-19",
            sum(CASE
                    WHEN age>=20
                         AND age<=30 THEN 1
                    ELSE 0
                END) AS "age_20-30",
            sum(CASE
                    WHEN age>=31
                         AND age<=45 THEN 1
                    ELSE 0
                END) AS "age_31-45",
            sum(CASE
                    WHEN age>=46
                         AND age<=59 THEN 1
                    ELSE 0
                END) AS "age_46-59",
            sum(CASE
                    WHEN age>=60 THEN 1
                    ELSE 0
                END) AS "age_60_above",
            sum(male_count) AS male_count,
            sum(female_count) AS female_count,
            engagers_count-conversion_count AS missed_opportunity_count_ec,
            group_count-conversion_count AS missed_opportunity_count_gc,
            '${data.query.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
     FROM(
            (SELECT temp_id || store_date || store_id AS tempid,
                    age,
                    male_count,
                    female_count
             FROM customer_demographics
             WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
               AND store_id in (${data.storeId})
               AND temp_id!=0 ) AS t1
          INNER JOIN
            (SELECT store_id,
                    store_date,
                    temp_id || store_date || store_id AS tempid,
                    group_id,
                    time_spent
             FROM customer_time_metrics
             WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
               AND store_id in (${data.storeId})
               AND temp_id!=0
               AND composite_inserted_at in
                 (SELECT max(composite_inserted_at)
                  FROM customer_time_metrics
                  WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                    AND store_id in (${data.storeId})
                  GROUP BY store_date,
                           store_id)) AS t2 ON t1.tempid=t2.tempid)
     GROUP BY store_id,
              store_date) AS p1
  INNER JOIN
    (SELECT t1.store_id AS store_id,
            t1.store_date AS store_date,
            substring(opening_time, 1, 5) AS opening_time,
            substring(closing_time, 1, 5) AS closing_time,
            substring(operating_time, 1, 5) AS operating_time,
            infra_down_time_minutes
     FROM(
            (SELECT store_id,
                    store_date,
                    opening_time,
                    closing_time,
                    operating_time
             FROM store_operation_metrics
             WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
               AND store_id in (${data.storeId})
               AND composite_inserted_at in
                 (SELECT max(composite_inserted_at)
                  FROM store_operation_metrics
                  WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                    AND store_id in (${data.storeId})
                  GROUP BY store_date,
                           store_id)) AS t1
          INNER JOIN
            (SELECT store_id,
                    store_date,
                    sum(downtime) AS infra_down_time_minutes
             FROM camera_operation_metrics
             WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
               AND store_id in (${data.storeId})
             GROUP BY store_id,
                      store_date) AS t2 ON t1.store_date=t2.store_date
          AND t1.store_id=t2.store_id)) AS p2 ON p1.store_date=p2.store_date
  AND p1.store_id=p2.store_id))
ORDER BY store_id,date
${data.limit_query}`.normalize();
}

// overall metrics count
module.exports.templateDCount = (data) =>{
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT p1.store_id,
            substring(p1.store_date, 1, 10) AS date,
            footfall_count,
            group_count,
            avg_time_spent,
            conversion_count,
            bounced_footfall_count,
            CASE
                WHEN missed_opportunity_type='engagers-conversion' THEN
                       (SELECT missed_opportunity_count_ec)
                ELSE
                       (SELECT missed_opportunity_count_gc)
            END AS missed_opportunity_count,
            "age_1-12",
            "age_13-19",
            "age_20-30",
            "age_31-45",
            "age_46-59",
            "age_60_above",
            male_count,
            female_count,
            opening_time,
            closing_time,
            operating_time,
            infra_down_time_minutes
     FROM ((
              (SELECT store_id,
                      store_date,
                      count(t1.tempid||store_date||store_id) AS footfall_count,
                      count(DISTINCT group_id||store_date||store_id) AS group_count,
                      AVG(time_spent) AS avg_time_spent,
                      SUM(CASE
                              WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                              ELSE 0
                          END) AS conversion_count,
                      SUM(CASE
                              WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
                              ELSE 0
                          END) AS bounced_footfall_count,
                      SUM(CASE
                              WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
                              ELSE 0
                          END) AS engagers_count,
                      sum(CASE
                              WHEN age>=1
                                   AND age<=12 THEN 1
                              ELSE 0
                          END) AS "age_1-12",
                      sum(CASE
                              WHEN age>=13
                                   AND age<=19 THEN 1
                              ELSE 0
                          END) AS "age_13-19",
                      sum(CASE
                              WHEN age>=20
                                   AND age<=30 THEN 1
                              ELSE 0
                          END) AS "age_20-30",
                      sum(CASE
                              WHEN age>=31
                                   AND age<=45 THEN 1
                              ELSE 0
                          END) AS "age_31-45",
                      sum(CASE
                              WHEN age>=46
                                   AND age<=59 THEN 1
                              ELSE 0
                          END) AS "age_46-59",
                      sum(CASE
                              WHEN age>=60 THEN 1
                              ELSE 0
                          END) AS "age_60_above",
                      sum(male_count) AS male_count,
                      sum(female_count) AS female_count,
                      engagers_count-conversion_count AS missed_opportunity_count_ec,
                      group_count-conversion_count AS missed_opportunity_count_gc,
                      '${data.query.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
               FROM(
                      (SELECT temp_id || store_date || store_id AS tempid,
                              age,
                              male_count,
                              female_count
                       FROM customer_demographics
                       WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                         AND store_id in (${data.storeId})
                         AND temp_id!=0 ) AS t1
                    INNER JOIN
                      (SELECT store_id,
                              store_date,
                              temp_id || store_date || store_id AS tempid,
                              group_id,
                              time_spent
                       FROM customer_time_metrics
                       WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                         AND store_id in (${data.storeId})
                         AND temp_id!=0
                         AND composite_inserted_at in
                           (SELECT max(composite_inserted_at)
                            FROM customer_time_metrics
                            WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                              AND store_id in (${data.storeId})
                            GROUP BY store_date,
                                     store_id)) AS t2 ON t1.tempid=t2.tempid)
               GROUP BY store_id,
                        store_date) AS p1
            INNER JOIN
              (SELECT t1.store_id AS store_id,
                      t1.store_date AS store_date,
                      substring(opening_time, 1, 5) AS opening_time,
                      substring(closing_time, 1, 5) AS closing_time,
                      substring(operating_time, 1, 5) AS operating_time,
                      infra_down_time_minutes
               FROM(
                      (SELECT store_id,
                              store_date,
                              opening_time,
                              closing_time,
                              operating_time
                       FROM store_operation_metrics
                       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                         AND store_id in (${data.storeId})
                         AND composite_inserted_at in
                           (SELECT max(composite_inserted_at)
                            FROM store_operation_metrics
                            WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                              AND store_id in (${data.storeId})
                            GROUP BY store_date,
                                     store_id)) AS t1
                    INNER JOIN
                      (SELECT store_id,
                              store_date,
                              sum(downtime) AS infra_down_time_minutes
                       FROM camera_operation_metrics
                       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                         AND store_id in (${data.storeId})
                       GROUP BY store_id,
                                store_date) AS t2 ON t1.store_date=t2.store_date
                    AND t1.store_id=t2.store_id)) AS p2 ON p1.store_date=p2.store_date
            AND p1.store_id=p2.store_id))
     ORDER BY store_id,date)`.normalize()
}

// custom metrics --hour wise data
module.exports.customTemplateHour = (data) =>{
 return `SELECT store_id,
 substring(store_date, 1, 10) AS date,HOUR 
 ${data.query.footfall_count_string} 
 ${data.query.bounced_footfall_count_string} 
 ${data.query.group_count_string}  
${data.query.engagers_count_string}
${data.query.missed_opportunity_count_string} 
  ${data.query.conversion_count_string} 
  ${data.query.avg_dwell_time_string} 
  ${data.query.age_string} 
  ${data.query.gender_string}
FROM
(SELECT store_id,
    store_date,
    extract(HOUR
            FROM date_time) AS HOUR,
    count(t1.tempid) AS footfall_count,
    count(DISTINCT group_id||store_date||store_id) AS group_count,
    SUM(CASE
            WHEN time_spent ${data.brand_config.brandConfigs.bouncedConfigTime} THEN 1
            ELSE 0
        END) AS bounced_footfall_count,
    SUM(CASE
            WHEN time_spent ${data.brand_config.brandConfigs.missedOpportunityStartTime} THEN 1
            ELSE 0
        END) AS engagers_count,
    SUM(CASE
            WHEN time_spent ${data.brand_config.brandConfigs.conversionConfigTime} THEN 1
            ELSE 0
        END) AS conversion_count,
    AVG(time_spent) AS avg_dwell_time,
    SUM(CASE
            WHEN age>=1
                 AND age<=12 THEN 1
            ELSE 0
        END) AS "age_1-12",
    SUM(CASE
            WHEN age>=13
                 AND age<=19 THEN 1
            ELSE 0
        END) AS "age_13-19",
    SUM(CASE
            WHEN age>=20
                 AND age<=30 THEN 1
            ELSE 0
        END) AS "age_20-30",
    SUM(CASE
            WHEN age>=31
                 AND age<=45 THEN 1
            ELSE 0
        END) AS "age_31-45",
    SUM(CASE
            WHEN age>=46
                 AND age<=59 THEN 1
            ELSE 0
        END) AS "age_46-59",
    SUM(CASE
            WHEN age>=60 THEN 1
            ELSE 0
        END) AS "age_60_above",
    SUM(male_count) AS male_count,
    SUM(female_count) AS female_count,
    engagers_count-conversion_count AS missed_opportunity_count_ec,
    group_count-conversion_count AS missed_opportunity_count_gc,
    '${data.brand_config.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
FROM (
     (SELECT date_time,
             store_date,
             store_id,
             temp_id||store_date||store_id AS tempid,
             group_id,
             time_spent
      FROM customer_time_metrics
      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
        AND store_id in (${data.storeId})
        AND temp_id!=0
        AND composite_inserted_at in
          (SELECT max(composite_inserted_at)
           FROM customer_time_metrics
           WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
             AND store_id in (${data.storeId})
           GROUP BY store_date,
                    store_id)) AS t1
   INNER JOIN
     (SELECT temp_id||store_date||store_id AS tempid,
             age,
             male_count,
             female_count
      FROM customer_demographics
      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
        AND store_id in (${data.storeId})
        AND temp_id!=0) AS t2 ON t1.tempid=t2.tempid)
GROUP BY store_id,
      store_date,
      HOUR)
ORDER BY store_id,date,HOUR
${data.limit_query}`.normalize();
}

// custom metrics count --hour wise data
module.exports.cusTempHrCount = (data) => {
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT store_id,
            substring(store_date, 1, 10) AS date,HOUR 
            ${data.query.footfall_count_string} 
            ${data.query.bounced_footfall_count_string} 
            ${data.query.group_count_string}  
           ${data.query.engagers_count_string}
           ${data.query.missed_opportunity_count_string} 
             ${data.query.conversion_count_string} 
             ${data.query.avg_dwell_time_string} 
             ${data.query.age_string} 
             ${data.query.gender_string}
     FROM
       (SELECT store_id,
               store_date,
               extract(HOUR
                       FROM date_time) AS HOUR,
               count(t1.tempid) AS footfall_count,
               count(DISTINCT group_id||store_date||store_id) AS group_count,
               SUM(CASE
                       WHEN time_spent ${data.brand_config.brandConfigs.bouncedConfigTime} THEN 1
                       ELSE 0
                   END) AS bounced_footfall_count,
               SUM(CASE
                       WHEN time_spent ${data.brand_config.brandConfigs.missedOpportunityStartTime} THEN 1
                       ELSE 0
                   END) AS engagers_count,
               SUM(CASE
                       WHEN time_spent ${data.brand_config.brandConfigs.conversionConfigTime} THEN 1
                       ELSE 0
                   END) AS conversion_count,
               AVG(time_spent) AS avg_dwell_time,
               SUM(CASE
                       WHEN age>=1
                            AND age<=12 THEN 1
                       ELSE 0
                   END) AS "age_1-12",
               SUM(CASE
                       WHEN age>=13
                            AND age<=19 THEN 1
                       ELSE 0
                   END) AS "age_13-19",
               SUM(CASE
                       WHEN age>=20
                            AND age<=30 THEN 1
                       ELSE 0
                   END) AS "age_20-30",
               SUM(CASE
                       WHEN age>=31
                            AND age<=45 THEN 1
                       ELSE 0
                   END) AS "age_31-45",
               SUM(CASE
                       WHEN age>=46
                            AND age<=59 THEN 1
                       ELSE 0
                   END) AS "age_46-59",
               SUM(CASE
                       WHEN age>=60 THEN 1
                       ELSE 0
                   END) AS "age_60_above",
               SUM(male_count) AS male_count,
               SUM(female_count) AS female_count,
               engagers_count-conversion_count AS missed_opportunity_count_ec,
               group_count-conversion_count AS missed_opportunity_count_gc,
               '${data.brand_config.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
        FROM (
                (SELECT date_time,
                        store_date,
                        store_id,
                        temp_id||store_date||store_id AS tempid,
                        group_id,
                        time_spent
                 FROM customer_time_metrics
                 WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                   AND store_id in (${data.storeId})
                   AND temp_id!=0
                   AND composite_inserted_at in
                     (SELECT max(composite_inserted_at)
                      FROM customer_time_metrics
                      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                        AND store_id in (${data.storeId})
                      GROUP BY store_date,
                               store_id)) AS t1
              INNER JOIN
                (SELECT temp_id||store_date||store_id AS tempid,
                        age,
                        male_count,
                        female_count
                 FROM customer_demographics
                 WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                   AND store_id in (${data.storeId})
                   AND temp_id!=0) AS t2 ON t1.tempid=t2.tempid)
        GROUP BY store_id,
                 store_date,
                 HOUR)
     ORDER BY store_id,date,HOUR)`.normalize();
}

// custom metrics --day wise data
module.exports.customTemplateDate = (data) => {
  return `SELECT store_id,
  substring(store_date, 1, 10) AS date 
  ${data.query.footfall_count_string} 
 ${data.query.bounced_footfall_count_string} 
 ${data.query.group_count_string}  
${data.query.engagers_count_string}
${data.query.missed_opportunity_count_string} 
  ${data.query.conversion_count_string} 
  ${data.query.avg_dwell_time_string} 
  ${data.query.age_string} 
  ${data.query.gender_string}
FROM
(SELECT store_id,
     store_date,
     count(t1.tempid) AS footfall_count,
     count(DISTINCT group_id||store_date||store_id) AS group_count,
     SUM(CASE
             WHEN time_spent ${data.brand_config.brandConfigs.bouncedConfigTime} THEN 1
             ELSE 0
         END) AS bounced_footfall_count,
     SUM(CASE
             WHEN time_spent  ${data.brand_config.brandConfigs.missedOpportunityStartTime} THEN 1
             ELSE 0
         END) AS engagers_count,
     SUM(CASE
             WHEN time_spent  ${data.brand_config.brandConfigs.conversionConfigTime} THEN 1
             ELSE 0
         END) AS conversion_count,
     AVG(time_spent) AS avg_dwell_time,
     SUM(CASE
             WHEN age>=1
                  AND age<=12 THEN 1
             ELSE 0
         END) AS "age_1-12",
     SUM(CASE
             WHEN age>=13
                  AND age<=19 THEN 1
             ELSE 0
         END) AS "age_13-19",
     SUM(CASE
             WHEN age>=20
                  AND age<=30 THEN 1
             ELSE 0
         END) AS "age_20-30",
     SUM(CASE
             WHEN age>=31
                  AND age<=45 THEN 1
             ELSE 0
         END) AS "age_31-45",
     SUM(CASE
             WHEN age>=46
                  AND age<=59 THEN 1
             ELSE 0
         END) AS "age_46-59",
     SUM(CASE
             WHEN age>=60 THEN 1
             ELSE 0
         END) AS "age_60_above",
     SUM(male_count) AS male_count,
     SUM(female_count) AS female_count,
     engagers_count-conversion_count AS missed_opportunity_count_ec,
     group_count-conversion_count AS missed_opportunity_count_gc,
     '${data.brand_config.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
FROM (
      (SELECT date_time,
              store_date,
              store_id,
              temp_id||store_date||store_id AS tempid,
              group_id,
              time_spent
       FROM customer_time_metrics
       WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
         AND store_id in (${data.storeId})
         AND temp_id!=0
         AND composite_inserted_at in
           (SELECT max(composite_inserted_at)
            FROM customer_time_metrics
            WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
              AND store_id in (${data.storeId})
            GROUP BY store_date,
                     store_id)) AS t1
    INNER JOIN
      (SELECT temp_id||store_date||store_id AS tempid,
              age,
              male_count,
              female_count
       FROM customer_demographics
       WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
         AND store_id in (${data.storeId})
         AND temp_id!=0) AS t2 ON t1.tempid=t2.tempid)
GROUP BY store_id,
       store_date)
ORDER BY store_id,date
${data.limit_query}`.normalize();
}

// custom metrics count --day wise data
module.exports.cusTempDateCount = (data) =>{
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT store_id,
            substring(store_date, 1, 10) AS date 
            ${data.query.footfall_count_string} 
            ${data.query.bounced_footfall_count_string} 
            ${data.query.group_count_string}  
           ${data.query.engagers_count_string}
           ${data.query.missed_opportunity_count_string} 
             ${data.query.conversion_count_string} 
             ${data.query.avg_dwell_time_string} 
             ${data.query.age_string} 
             ${data.query.gender_string}
     FROM
       (SELECT store_id,
               store_date,
               count(t1.tempid) AS footfall_count,
               count(DISTINCT group_id||store_date||store_id) AS group_count,
               SUM(CASE
                       WHEN time_spent ${data.brand_config.brandConfigs.bouncedConfigTime} THEN 1
                       ELSE 0
                   END) AS bounced_footfall_count,
               SUM(CASE
                       WHEN time_spent ${data.brand_config.brandConfigs.missedOpportunityStartTime} THEN 1
                       ELSE 0
                   END) AS engagers_count,
               SUM(CASE
                       WHEN time_spent ${data.brand_config.brandConfigs.conversionConfigTime} THEN 1
                       ELSE 0
                   END) AS conversion_count,
               AVG(time_spent) AS avg_dwell_time,
               SUM(CASE
                       WHEN age>=1
                            AND age<=12 THEN 1
                       ELSE 0
                   END) AS "age_1-12",
               SUM(CASE
                       WHEN age>=13
                            AND age<=19 THEN 1
                       ELSE 0
                   END) AS "age_13-19",
               SUM(CASE
                       WHEN age>=20
                            AND age<=30 THEN 1
                       ELSE 0
                   END) AS "age_20-30",
               SUM(CASE
                       WHEN age>=31
                            AND age<=45 THEN 1
                       ELSE 0
                   END) AS "age_31-45",
               SUM(CASE
                       WHEN age>=46
                            AND age<=59 THEN 1
                       ELSE 0
                   END) AS "age_46-59",
               SUM(CASE
                       WHEN age>=60 THEN 1
                       ELSE 0
                   END) AS "age_60_above",
               SUM(male_count) AS male_count,
               SUM(female_count) AS female_count,
               engagers_count-conversion_count AS missed_opportunity_count_ec,
               group_count-conversion_count AS missed_opportunity_count_gc,
               '${data.brand_config.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
        FROM (
                (SELECT date_time,
                        store_date,
                        store_id,
                        temp_id||store_date||store_id AS tempid,
                        group_id,
                        time_spent
                 FROM customer_time_metrics
                 WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                   AND store_id in (${data.storeId})
                   AND temp_id!=0
                   AND composite_inserted_at in
                     (SELECT max(composite_inserted_at)
                      FROM customer_time_metrics
                      WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                        AND store_id in (${data.storeId})
                      GROUP BY store_date,
                               store_id)) AS t1
              INNER JOIN
                (SELECT temp_id||store_date||store_id AS tempid,
                        age,
                        male_count,
                        female_count
                 FROM customer_demographics
                 WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                   AND store_id in (${data.storeId})
                   AND temp_id!=0) AS t2 ON t1.tempid=t2.tempid)
        GROUP BY store_id,
                 store_date)
     ORDER BY store_id,date)`.normalize();
}