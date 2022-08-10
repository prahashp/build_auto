/**
 * @name dashboard_conversion_query
 * @description Stores DB Service
 * @author praveenraj
 *
 */

//Card
module.exports.card_query = (data) => {
     return `SELECT count(temp_id||store_date||store_id) AS footfall_count,
     SUM (CASE
              WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
              ELSE 0
          END) AS bounced_footfall_count,
         SUM (CASE
                  WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
                  ELSE 0
              END) AS engagers_count,
             count(DISTINCT CASE
                                WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN
                                       (SELECT store_date+store_id+group_id)
                            END) AS engagers_group_count,
             SUM (CASE
                      WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                      ELSE 0
                  END) AS conversion_count,
                 count(DISTINCT store_date||store_id||group_id) AS group_count,
                 count(DISTINCT CASE
                                    WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                           (SELECT store_date+store_id+group_id)
                                END) AS conversion_group_count,
                 count(DISTINCT CASE
                                    WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                           (SELECT store_date+store_id+group_id)
                                END) AS bounced_group_count
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
            store_id)`.normalize();             
};

//table daily data
module.exports.daily_report_table = (data) => {
  return `SELECT date,footfall_count,
bounced_footfall_count,
engagers_count,
group_count,
CASE
    WHEN missed_opportunity_type='engagers-conversion' THEN
           (SELECT missed_opportunity_count_ec)
    ELSE
           (SELECT missed_opportunity_count_gc)
END AS missed_opportunity_count,
conversion_count,
avg_dwell_time
FROM
(SELECT substring(date,1, 10) AS date,
footfall_count,
bounced_footfall_count,
engagers_count,
group_count,
conversion_count,
engagers_count-conversion_count AS missed_opportunity_count_ec,
group_count-conversion_count AS missed_opportunity_count_gc,
avg_dwell_time,
'${data.query.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
FROM
(SELECT store_date AS date,
 count(temp_id) AS footfall_count,
 SUM (CASE
          WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
          ELSE 0
      END) AS bounced_footfall_count,
     SUM (CASE
              WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
              ELSE 0
          END) AS engagers_count,
         count(DISTINCT group_id||store_date||store_id) AS group_count,
         SUM (CASE
                  WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                  ELSE 0
              END) AS conversion_count,
             AVG(time_spent) AS avg_dwell_time
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
GROUP BY date))
ORDER BY date
${data.limit_query}`.normalize();
};

//table daily data count
module.exports.report_table_count = (data) => {
  return `SELECT count(*) AS total_records_count
  FROM
    (SELECT date,footfall_count,
                 bounced_footfall_count,
                 engagers_count,
                 group_count,
                 CASE
                     WHEN missed_opportunity_type='engagers-conversion' THEN
                            (SELECT missed_opportunity_count_ec)
                     ELSE
                            (SELECT missed_opportunity_count_gc)
                 END AS missed_opportunity_count,
                 conversion_count,
                 avg_dwell_time
     FROM
       (SELECT substring(date,1, 10) AS date,
               footfall_count,
               bounced_footfall_count,
               engagers_count,
               group_count,
               conversion_count,
               engagers_count-conversion_count AS missed_opportunity_count_ec,
               group_count-conversion_count AS missed_opportunity_count_gc,
               avg_dwell_time,
               '${data.query.brandConfigs.missedOpportunityCalculate}' AS missed_opportunity_type
        FROM
          (SELECT store_date AS date,
                  count(temp_id) AS footfall_count,
                  SUM (CASE
                           WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
                           ELSE 0
                       END) AS bounced_footfall_count,
                      SUM (CASE
                               WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
                               ELSE 0
                           END) AS engagers_count,
                          count(DISTINCT group_id||store_date||store_id) AS group_count,
                          SUM (CASE
                                   WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                                   ELSE 0
                               END) AS conversion_count,
                              AVG(time_spent) AS avg_dwell_time
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
           GROUP BY date)))`.normalize();
};

//dwell
module.exports.dwell = (data) => {
  return `SELECT extract(dayofweek
          FROM date_time) AS DAY,
  substring(convert(varchar, date_time::TIMESTAMP), 12, 2) || ':00' AS HOUR,
  count(temp_id) AS footfall_count
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
GROUP BY DAY,
    HOUR
ORDER BY DAY,
    HOUR`.normalize();
};

//Graph hourly
module.exports.hourly_graph = (data) => {

  return `SELECT substring(convert(varchar, date_time::TIMESTAMP), 1, 14) || '00' AS HOUR,
  to_char(date_time, 'YYYY-MM-DD HH24:MI:SS.000Z') AS date1,
  count(temp_id||store_date||store_id) AS footfall_count,
  SUM (CASE
           WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
           ELSE 0
       END) AS bounced_footfall_count,
      SUM (CASE
               WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
               ELSE 0
           END) AS engagers_count,
          count(DISTINCT CASE
                             WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN
                                    (SELECT store_date+store_id+group_id)
                         END) AS engagers_group_count,
          SUM (CASE
                   WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                   ELSE 0
               END) AS conversion_count,
              count(DISTINCT store_date||store_id||group_id) AS group_count,
              count(DISTINCT CASE
                                 WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                        (SELECT store_date+store_id+group_id)
                             END) AS conversion_group_count,
              count(DISTINCT CASE
                                 WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                        (SELECT store_date+store_id+group_id)
                             END) AS bounced_group_count
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
GROUP BY HOUR,
    date_time
ORDER BY HOUR,
    date_time`.normalize();  
};

//Graph Daily
module.exports.daily_graph = (data) => {

return`SELECT substring(store_date,1, 10) as date1,
store_id,
count(temp_id||store_date||store_id) AS footfall_count,
SUM (CASE
         WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
         ELSE 0
     END) AS bounced_footfall_count,
    SUM (CASE
             WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
             ELSE 0
         END) AS engagers_count,
        count(DISTINCT CASE
                           WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN
                                  (SELECT store_date+store_id+group_id)
                       END) AS engagers_group_count,
        SUM (CASE
                 WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                 ELSE 0
             END) AS conversion_count,
            count(DISTINCT store_date||store_id||group_id) AS group_count,
            count(DISTINCT CASE
                               WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                      (SELECT store_date+store_id+group_id)
                           END) AS conversion_group_count,
            count(DISTINCT CASE
                               WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                      (SELECT store_date+store_id+group_id)
                           END) AS bounced_group_count
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
GROUP BY store_date,
  store_id
ORDER BY store_date,
  store_id`.normalize();
};

//Graph weekly
module.exports.weekly_graph = (data) => {

return `SELECT extract(YEAR
  FROM date_time) || '-' || extract(WEEK
                                    FROM date_time) AS date,
substring(min(store_date), 1, 10) AS date1,
count(temp_id||store_date||store_id) AS footfall_count,
SUM (CASE
   WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
   ELSE 0
END) AS bounced_footfall_count,
SUM (CASE
       WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
       ELSE 0
   END) AS engagers_count,
  count(DISTINCT CASE
                     WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN
                            (SELECT store_date+store_id+group_id)
                 END) AS engagers_group_count,
  SUM (CASE
           WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
           ELSE 0
       END) AS conversion_count,
      count(DISTINCT store_date||store_id||group_id) AS group_count,
      count(DISTINCT CASE
                         WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                (SELECT store_date+store_id+group_id)
                     END) AS conversion_group_count,
      count(DISTINCT CASE
                         WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                (SELECT store_date+store_id+group_id)
                     END) AS bounced_group_count
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
GROUP BY date
ORDER BY date`.normalize();
};

//Graph weekly
module.exports.monthly_graph = (data) => {
  return `SELECT substring(convert(varchar, date_time::TIMESTAMP), 1, 7) AS date,
  substring(min(store_date), 1, 10) AS date1,
  count(temp_id||store_date||store_id) AS footfall_count,
  SUM (CASE
           WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
           ELSE 0
       END) AS bounced_footfall_count,
      SUM (CASE
               WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
               ELSE 0
           END) AS engagers_count,
          count(DISTINCT CASE
                             WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN
                                    (SELECT store_date+store_id+group_id)
                         END) AS engagers_group_count,
          SUM (CASE
                   WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
                   ELSE 0
               END) AS conversion_count,
              count(DISTINCT store_date||store_id||group_id) AS group_count,
              count(DISTINCT CASE
                                 WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                        (SELECT store_date+store_id+group_id)
                             END) AS conversion_group_count,
              count(DISTINCT CASE
                                 WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                        (SELECT store_date+store_id+group_id)
                             END) AS bounced_group_count
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
GROUP BY date
ORDER BY date`.normalize();
};
