


module.exports.feature_card = (data) => {
    return `select count(t1.tempid) as total_footfall_count,sum(case  WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1 ELSE 0 end) as coversion_count,sum("1-12") as "age_1-12",sum("13-19") as "age_13-19",sum("20-30") as "age_20-30",sum("31-45") as "age_31-45",sum("46-59") as "age_46-59",sum("60+") as "age_60_above",sum(male_count) as male_count,sum(female_count) as female_count,avg(time_spent) as avg_dwell_time 
from((select store_date,store_id,temp_id||store_date||store_id as tempid,
   sum(case   
	      WHEN age>=1 AND age<=12 THEN 1
          ELSE 0
          end) as "1-12",
      sum(CASE
          WHEN age>=13 AND age<=19 THEN 1
          ELSE 0
          end) as "13-19",
      sum(case
	      WHEN age>=20 AND age<=30 THEN 1
          ELSE 0
          end) as "20-30",
      sum(case 
	      WHEN age>=31 AND age<=45 THEN 1
          ELSE 0
          end) as "31-45",   
      sum(case 
	      WHEN age>=46 AND age<=59 THEN 1
          ELSE 0
          end) as "46-59",
      sum(case 
	      WHEN age>=60 THEN 1
	       ELSE 0
	      end) as "60+",sum(male_count) as male_count,sum(female_count) as female_count from customer_demographics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and  store_id in (${data.storeId}) and temp_id!=0  group by store_date,store_id,temp_id) as t1
inner join 
(select group_id,temp_id ||store_date||store_id as tempid,time_spent from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0 and composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by store_date,store_id)) as t2 on t1.tempid=t2.tempid)`.normalize()
}


module.exports.footfall = (data) => {
    return `select store_id,footfall_count,conversion_count from (
        select store_id,footfall_count,conversion_count,(cast(conversion_count as real)/cast(footfall_count as real)) as conversion_ratio from (
        SELECT  
                store_id,
                count(temp_id||store_date||store_id) as footfall_count,
                SUM (CASE
                       WHEN time_spent${data.query.brandConfigs.conversionConfigTime}  THEN 1
                   ELSE 0
                  END
                ) as conversion_count	
        from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0 and
        composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by 
        store_date,store_id) group by store_id ) order by conversion_ratio desc limit 10)`.normalize()
}


module.exports.avg_dwell_time = (data) => {
    return `SELECT store_id,count(temp_id||store_date||store_id) as footfall_count,AVG(time_spent) as avg_dwell_time from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0 and composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by store_date,store_id) group by store_id order by avg_dwell_time desc limit 10`
}

module.exports.overviewtable = (data) => {
    return`SELECT substring(store_date, 1, 10) AS date,
    store_id,
    sum(footfall_count) AS footfall_count,
    sum(bounced_footfall_count) AS bounced_footfall_count,
    sum(group_count) AS group_count,
    sum(missed_opportunity_count) AS missed_opportunity_count,
    sum(conversion_count) AS conversion_count,
    avg(avg_time_spent) AS avg_time_spent,
    sum(infra_down_time_minutes) AS infra_down_time_minutes,
    sum("age_1-12") AS "age_1-12",
    sum("age_13-19") AS "age_13-19",
    sum("age_20-30") AS "age_20-30",
    sum("age_31-45") AS "age_31-45",
    sum("age_46-59") AS "age_46-59",
    sum("age_60_above") AS "age_60_above",
    sum(male_count) AS male_count,
    sum(female_count) AS female_count
FROM
(SELECT p1.store_id,
       p2.store_date,
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
       infra_down_time_minutes
FROM (
        (SELECT store_id,
                store_date,
                count(t1.tempid||store_date||store_id) AS footfall_count,
                count(DISTINCT store_date||store_id||group_id) AS group_count,
                count(DISTINCT CASE
                                   WHEN time_spent>=5 THEN
                                          (SELECT store_date+store_id+group_id)
                               END) AS conversion_group_count,
                count(DISTINCT CASE
                                   WHEN time_spent<2 THEN
                                          (SELECT store_date+store_id+group_id)
                               END) AS bounced_group_count,
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
                group_count-conversion_group_count-bounced_group_count AS missed_opportunity_count_gc,
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
        (SELECT store_id,
                store_date,
                sum(downtime) AS infra_down_time_minutes
         FROM camera_operation_metrics
         WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
           AND store_id in (${data.storeId})
         GROUP BY store_id,
                  store_date) AS p2 ON p1.store_date=p2.store_date
      AND p1.store_id=p2.store_id))
GROUP BY date,store_id
ORDER BY date,store_id
${data.limit_query}`.normalize();    
}

module.exports.overviewTableCount = (data) =>{
  return `SELECT count(DISTINCT t1.store_id_store_date) AS total_records_count
    FROM ((
             (SELECT store_id||store_date AS store_id_store_date
              FROM customer_time_metrics
              WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                AND store_id in (${data.storeId})
                AND composite_inserted_at in
                  (SELECT max(composite_inserted_at)
                   FROM customer_time_metrics
                   WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                     AND store_id in (${data.storeId})
                   GROUP BY store_date,
                            store_id)) AS t1
           INNER JOIN
             (SELECT store_id||store_date AS store_id_store_date
              FROM customer_demographics
              WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                AND store_id in (${data.storeId})) AS t2 ON t1.store_id_store_date=t2.store_id_store_date)
          INNER JOIN
            (SELECT store_id||store_date AS store_id_store_date
             FROM camera_operation_metrics
             WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
               AND store_id in (${data.storeId})) AS t3 ON t1.store_id_store_date=t3.store_id_store_date)`.normalize();   
}

module.exports.overviewTableSort =(data) =>{
  return`SELECT substring(store_date, 1, 10) AS date,
  store_id,
  sum(footfall_count) AS footfall_count,
  sum(bounced_footfall_count) AS bounced_footfall_count,
  sum(group_count) AS group_count,
  sum(missed_opportunity_count) AS missed_opportunity_count,
  sum(conversion_count) AS conversion_count,
  avg(avg_time_spent) AS avg_time_spent,
  sum(infra_down_time_minutes) AS infra_down_time_minutes,
  sum("age_1-12") AS "age_1-12",
  sum("age_13-19") AS "age_13-19",
  sum("age_20-30") AS "age_20-30",
  sum("age_31-45") AS "age_31-45",
  sum("age_46-59") AS "age_46-59",
  sum("age_60_above") AS "age_60_above",
  sum(male_count) AS male_count,
  sum(female_count) AS female_count
FROM
(SELECT p1.store_id,
     p2.store_date,
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
     infra_down_time_minutes
FROM (
      (SELECT store_id,
              store_date,
              count(t1.tempid||store_date||store_id) AS footfall_count,
              count(DISTINCT store_date||store_id||group_id) AS group_count,
              count(DISTINCT CASE
                                 WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                        (SELECT store_date+store_id+group_id)
                             END) AS conversion_group_count,
              count(DISTINCT CASE
                                 WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                        (SELECT store_date+store_id+group_id)
                             END) AS bounced_group_count,
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
              group_count-conversion_group_count-bounced_group_count AS missed_opportunity_count_gc,
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
      (SELECT store_id,
              store_date,
              sum(downtime) AS infra_down_time_minutes
       FROM camera_operation_metrics
       WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
         AND store_id in (${data.storeId})
       GROUP BY store_id,
                store_date) AS p2 ON p1.store_date=p2.store_date
    AND p1.store_id=p2.store_id))
GROUP BY date,store_id
ORDER BY "${data.column_name}" ${data.order_type}
${data.limit_query}`.normalize();
}

module.exports.overviewTableSearch = (data) =>{
  return `SELECT * FROM
    (SELECT substring(store_date, 1, 10) AS date,
            store_id,
            sum(footfall_count) AS footfall_count,
            sum(bounced_footfall_count) AS bounced_footfall_count,
            sum(group_count) AS group_count,
            sum(missed_opportunity_count) AS missed_opportunity_count,
            sum(conversion_count) AS conversion_count,
            avg(avg_time_spent) AS avg_time_spent,
            sum(infra_down_time_minutes) AS infra_down_time_minutes,
            sum("age_1-12") AS "age_1-12",
            sum("age_13-19") AS "age_13-19",
            sum("age_20-30") AS "age_20-30",
            sum("age_31-45") AS "age_31-45",
            sum("age_46-59") AS "age_46-59",
            sum("age_60_above") AS "age_60_above",
            sum(male_count) AS male_count,
            sum(female_count) AS female_count
     FROM
       (SELECT p1.store_id,
               p2.store_date,
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
               infra_down_time_minutes
        FROM (
                (SELECT store_id,
                        store_date,
                        count(t1.tempid||store_date||store_id) AS footfall_count,
                        count(DISTINCT store_date||store_id||group_id) AS group_count,
                        count(DISTINCT CASE
                                           WHEN time_spent${data.query.brandConfigs.conversionConfigTime} THEN
                                                  (SELECT store_date+store_id+group_id)
                                       END) AS conversion_group_count,
                        count(DISTINCT CASE
                                           WHEN time_spent${data.query.brandConfigs.bouncedConfigTime} THEN
                                                  (SELECT store_date+store_id+group_id)
                                       END) AS bounced_group_count,
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
                        group_count-conversion_group_count-bounced_group_count AS missed_opportunity_count_gc,
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
                (SELECT store_id,
                        store_date,
                        sum(downtime) AS infra_down_time_minutes
                 FROM camera_operation_metrics
                 WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                   AND store_id in (${data.storeId})
                 GROUP BY store_id,
                          store_date) AS p2 ON p1.store_date=p2.store_date
              AND p1.store_id=p2.store_id))
     GROUP BY date,store_id)
  WHERE store_id||date like '%${data.searchValue}%'
  ${data.limit_query}`.normalize();
}

module.exports.overviewSearchCount =(data) =>{
  return`SELECT count(t1.store_id_store_date) AS total_records_count
  FROM ((
           (SELECT DISTINCT store_id||store_date AS store_id_store_date
            FROM customer_time_metrics
            WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
              AND store_id in (${data.storeId})
              AND composite_inserted_at in
                (SELECT max(composite_inserted_at)
                 FROM customer_time_metrics
                 WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
                   AND store_id in (${data.storeId})
                 GROUP BY store_date,
                          store_id)) AS t1
         INNER JOIN
           (SELECT DISTINCT store_id||store_date AS store_id_store_date
            FROM customer_demographics
            WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
              AND store_id in (${data.storeId})) AS t2 ON t1.store_id_store_date=t2.store_id_store_date)
        INNER JOIN
          (SELECT DISTINCT store_id||store_date AS store_id_store_date
           FROM camera_operation_metrics
           WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
             AND store_id in (${data.storeId})) AS t3 ON t1.store_id_store_date=t3.store_id_store_date)
  WHERE t1.store_id_store_date like '%${data.searchValue}%'`.normalize();
}

module.exports.footfallcard = (data) => {
    return `
    select total_footfall_count,bounced_footfall_count,case when missed_opportunity_type='engagers-conversion' then (select engagers_count-conversion_count) else (select group_count-conversion_count) end as missed_opportunity_count,conversion_count from (select total_footfall_count,bounced_footfall_count,engagers_count,group_count,conversion_count,'${data.query.brandConfigs.missedOpportunityCalculate}' as missed_opportunity_type from(
    SELECT  
            count(temp_id||store_date||store_id) as total_footfall_count,
            SUM (CASE
                   WHEN time_spent${data.query.brandConfigs.bouncedConfigTime}  THEN 1
               ELSE 0
              END
            ) AS bounced_footfall_count,
            SUM (CASE
                   WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime} THEN 1
               ELSE 0
              END
            ) AS engagers_count,
            SUM (CASE
                   WHEN time_spent${data.query.brandConfigs.conversionConfigTime}  THEN 1
               ELSE 0
              END
            ) AS conversion_count,
           count(distinct group_id||store_date||store_id) as group_count
    from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0 and
    composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by 
    store_date,store_id))
    )
    `.normalize();
}

module.exports.trafficcard = (data) => {
    return `
    select total_footfall,overall_group_count,individual_shopper,group_shoppers,"age_1-12","age_13-19","age_20-30","age_31-45","age_46-59","age_60_above",male_count,female_count from (
    (select 'test' as temp,sum(group_head_count) as total_footfall,count(group_head_count) as overall_group_count,sum(case when group_head_count=1 then 1 else 0 end) as individual_shopper,sum(case when group_head_count>1 then (select group_head_count) else 0 end) as group_shoppers from (select group_id || store_date as groupid,count(temp_id||store_date||store_id) as group_head_count from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0  and composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by store_date,store_id)
    group by groupid)) as p1
    inner join
    (select 
          'test' as temp,
          sum(case   
              WHEN age>=1 AND age<=12 THEN 1
              ELSE 0
              end) as "age_1-12",
          sum(CASE
              WHEN age>=13 AND age<=19 THEN 1
              ELSE 0
              end) as "age_13-19",
          sum(case
              WHEN age>=20 AND age<=30 THEN 1
              ELSE 0
              end) as "age_20-30",
          sum(case 
              WHEN age>=31 AND age<=45 THEN 1
              ELSE 0
              end) as "age_31-45",   
          sum(case 
              WHEN age>=46 AND age<=59 THEN 1
              ELSE 0
              end) as "age_46-59",
          sum(case 
              WHEN age>=60 THEN 1
               ELSE 0
              end) as "age_60_above",
          sum(male_count) as male_count,
          sum(female_count) as female_count  
    from(	      
    (select temp_id || store_date || store_id as tempid,age,male_count,female_count from customer_demographics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and  store_id in (${data.storeId}) and temp_id!=0 ) as t1
    inner join 
    (select store_id,store_date,temp_id || store_date || store_id as tempid from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0 and composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by store_date,store_id)) as t2
    on t1.tempid=t2.tempid)) as p2 
    on p1.temp=p2.temp)
    `.normalize()
}


module.exports.top_perform_store = (data) => {
    return `
    select store_id,footfall,male_count,female_count,
    case 
        WHEN avg_age>=1 AND avg_age<=12 THEN '1-12'
        WHEN avg_age>=13 AND avg_age<=19 THEN '13-19'
        WHEN avg_age>=20 AND avg_age<=30 THEN '20-30'
        WHEN avg_age>=31 AND avg_age<=45 THEN '31-45'
        WHEN avg_age>=46 AND avg_age<=59 THEN '46-59'
        WHEN avg_age>=60 THEN '60_above'
        else 'NA'
        end as avg_age_range from(
    select store_id,count(t1.tempid) as footfall,sum(male_count) as male_count,sum(female_count) as female_count,avg(age) as avg_age from(	      
    (select temp_id || store_date || store_id as tempid,age,male_count,female_count from customer_demographics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and  store_id in (${data.storeId}) and temp_id!=0 ) as t1
    inner join 
    (select store_id,store_date,temp_id || store_date || store_id as tempid from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) and temp_id!=0 and composite_inserted_at in (select max(composite_inserted_at) from customer_time_metrics where date_time BETWEEN '${data.fromDate} 00:00:00' and '${data.toDate} 23:59:59' and store_id in (${data.storeId}) group by store_date,store_id)) as t2
    on t1.tempid=t2.tempid) group by store_id) order by footfall desc limit 10
    `.normalize()
}

module.exports.gender_age_analysis = (data) => {
    return `SELECT store_id,
    count(t1.tempid) AS total_footfall,
    sum(male_count) AS male_count,
    sum(female_count) AS female_count,
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
        END) AS "age_60_above"
FROM(
    (SELECT temp_id || store_date || store_id AS tempid,
            age,
            male_count,
            female_count
     FROM customer_demographics
     WHERE date_time BETWEEN '${data.fromDate} 00:00:00' AND '${data.toDate} 23:59:59'
       AND store_id in ('${data.storeId}')
       AND temp_id!=0 ) AS t1
  INNER JOIN
    (SELECT store_id,
            store_date,
            temp_id || store_date || store_id AS tempid
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
                   store_id)) AS t2 ON t1.tempid=t2.tempid)
GROUP BY store_id`.normalize()
}

module.exports.daily_group_graph = (data) => {
    return `SELECT   store_date,
    Sum(
    CASE
             WHEN group_head_count=1 THEN 1
             ELSE 0
    END) AS individual_shopper,
    Sum(
    CASE
             WHEN group_head_count>1 THEN
                      (
                             SELECT group_head_count)
             ELSE 0
    END) AS group_shopper
FROM     (
             SELECT   store_date,
                      group_id
                               ||store_date
                               ||store_id AS groupid,
                      Count(temp_id
                               ||store_date
                               ||store_id) AS group_head_count
             FROM     customer_time_metrics
             WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
             AND      store_id IN (${data.storeId})
             AND      temp_id!=0
             AND      composite_inserted_at IN
                      (
                               SELECT   max(composite_inserted_at)
                               FROM     customer_time_metrics
                               WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
                               AND      store_id IN (${data.storeId})
                               GROUP BY store_date,
                                        store_id)
             GROUP BY store_date,
                      groupid)
GROUP BY store_date
ORDER BY store_date
    `.normalize()
}

module.exports.weekly_group_graph = (data) => {
    return `
    SELECT   Substring(store_date,1,5)
    || Date_part(week,store_date)::integer AS week,
min(store_date)                                 AS week_starting_date,
sum(
CASE
    WHEN group_head_count=1 THEN 1
    ELSE 0
END) AS individual_shopper,
sum(
CASE
    WHEN group_head_count>1 THEN
             (
                    SELECT group_head_count)
    ELSE 0
END) AS group_shopper
FROM     (
    SELECT   store_date,
             group_id
                      ||store_date
                      ||store_id AS groupid,
             count(temp_id
                      ||store_date
                      ||store_id) AS group_head_count
    FROM     customer_time_metrics
    WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
    AND      store_id IN (${data.storeId})
    AND      temp_id!=0
    AND      composite_inserted_at IN
             (
                      SELECT   max(composite_inserted_at)
                      FROM     customer_time_metrics
                      WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
                      AND      store_id IN (${data.storeId})
                      GROUP BY store_date,
                               store_id)
    GROUP BY store_date,
             groupid)
GROUP BY week
ORDER BY week
    `.normalize()
}

module.exports.monthly_group_graph = (data) => {
    return `SELECT   Substring(store_date,1,7) AS month,
    Min(store_date)           AS month_starting_date,
    Sum(
    CASE
             WHEN group_head_count=1 THEN 1
             ELSE 0
    END) AS individual_shopper,
    Sum(
    CASE
             WHEN group_head_count>1 THEN
                      (
                             SELECT group_head_count)
             ELSE 0
    END) AS group_shopper
FROM     (
             SELECT   store_date,
                      group_id
                               ||store_date
                               ||store_id AS groupid,
                      Count(temp_id
                               ||store_date
                               ||store_id) AS group_head_count
             FROM     customer_time_metrics
             WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
             AND      store_id IN (${data.storeId})
             AND      temp_id!=0
             AND      composite_inserted_at IN
                      (
                               SELECT   max(composite_inserted_at)
                               FROM     customer_time_metrics
                               WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
                               AND      store_id IN (${data.storeId})
                               GROUP BY store_date,
                                        store_id)
             GROUP BY store_date,
                      groupid)
GROUP BY month
ORDER BY month  
    `.normalize()
}
module.exports.group_top_perform_store = (data) => {
    return `
    SELECT   store_id,
    footfall,
    individual_shopper,
    group_shopper
FROM     (
             SELECT   store_id,
                      Sum(
                      CASE
                               WHEN group_head_count=1 THEN 1
                               ELSE 0
                      END) AS individual_shopper,
                      Sum(
                      CASE
                               WHEN group_head_count>1 THEN
                                        (
                                               SELECT group_head_count)
                               ELSE 0
                      END)                             AS group_shopper,
                      individual_shopper+group_shopper AS footfall
             FROM     (
                               SELECT   store_id,
                                        group_id
                                                 ||store_date
                                                 ||store_id AS groupid,
                                        Count(temp_id
                                                 ||store_date
                                                 ||store_id) AS group_head_count
                               FROM     customer_time_metrics
                               WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
                               AND      store_id IN (${data.storeId})
                               AND      temp_id!=0
                               AND      composite_inserted_at IN
                                        (
                                                 SELECT   max(composite_inserted_at)
                                                 FROM     customer_time_metrics
                                                 WHERE    date_time BETWEEN '${data.fromDate} 00:00:00' AND      '${data.toDate} 23:59:59'
                                                 AND      store_id IN (${data.storeId})
                                                 GROUP BY store_date,
                                                          store_id)
                               GROUP BY store_id,
                                        groupid)
             GROUP BY store_id)
ORDER BY footfall DESC limit 10
    `.normalize()
}

module.exports.lateopen_stores = (data) => {
    return `SELECT Count(DISTINCT store_id) AS total_late_opened_stores
    FROM   store_operation_metrics
    WHERE  store_date BETWEEN '${data.fromDate}' AND    '${data.toDate}'
    AND    store_id IN (${data.storeId})
    AND    substring(opening_time,1,5)>'09:30'
    AND    composite_inserted_at IN
           (
                    SELECT   max(composite_inserted_at)
                    FROM     store_operation_metrics
                    WHERE    store_date BETWEEN '${data.fromDate}' AND      '${data.toDate}'
                    AND      store_id IN (${data.storeId})
                    GROUP BY store_id,
                             store_date)`.normalize()
}
module.exports.earlyclose_stores = (data) => {
    return `SELECT Count(DISTINCT store_id) AS total_early_closed_stores
    FROM   store_operation_metrics
    WHERE  store_date BETWEEN '${data.fromDate}' AND    '${data.toDate}'
    AND    store_id IN (${data.storeId})
    AND    substring(closing_time,1,5)<'22:30'
    AND    composite_inserted_at IN
           (
                    SELECT   max(composite_inserted_at)
                    FROM     store_operation_metrics
                    WHERE    store_date BETWEEN '${data.fromDate}' AND      '${data.toDate}'
                    AND      store_id IN (${data.storeId})
                    GROUP BY store_id,
                             store_date)`.normalize()
}
module.exports.avg_optime_lateopen_stores = (data) => {
    return `SELECT   store_id,
         substring(timestamp 'epoch' + avg_opening_time * interval '1 Second ',12,5) AS avg_opening_time
FROM     (
                  SELECT   store_id,
                           avg(open_hour*3600+open_minute*60+open_second) AS avg_opening_time
                  FROM     (
                                  SELECT store_id,
                                         cast(substring(opening_time,1,2) AS integer) AS open_hour,
                                         cast(substring(opening_time,4,2) AS integer) AS open_minute,
                                         cast(substring(opening_time,7,2) AS integer) AS open_second
                                  FROM   store_operation_metrics
                                  WHERE  store_date BETWEEN '${data.fromDate}' AND    '${data.toDate}'
                                  AND    store_id IN (${data.storeId})
                                  AND    substring(opening_time,1,5)>'09:30'
                                  AND    composite_inserted_at IN
                                         (
                                                  SELECT   max(composite_inserted_at)
                                                  FROM     store_operation_metrics
                                                  WHERE    store_date BETWEEN '${data.fromDate}' AND      '${data.toDate}'
                                                  AND      store_id IN (${data.storeId})
                                                  GROUP BY store_id,
                                                           store_date))
                  GROUP BY store_id)
ORDER BY avg_opening_time DESC limit 20`.normalize()
}
module.exports.avg_cltime_earlyclose_stores = (data) => {
    return `
    select store_id,substring(TIMESTAMP 'epoch' + avg_closing_time * INTERVAL '1 Second ',12,5) as avg_closing_time from (select store_id,avg(close_hour*3600+close_minute*60+close_second) as avg_closing_time from (select store_id,cast(substring(closing_time,1,2) as integer) as close_hour,cast(substring(closing_time,4,2) as integer) as close_minute,cast(substring(closing_time,7,2) as integer) as close_second
from store_operation_metrics where store_date BETWEEN '${data.fromDate}' and '${data.toDate}' and store_id in (${data.storeId}) and substring(closing_time,1,5)<'22:30' and composite_inserted_at in (select max(composite_inserted_at) from store_operation_metrics where store_date BETWEEN '${data.fromDate}' and '${data.toDate}' and store_id in (${data.storeId}) group by store_id,store_date))
group by store_id) order by avg_closing_time asc limit 20`.normalize()
}
module.exports.deploy_operation_table = (data) => {
    return `SELECT   store_id,
    store_date,
    opening_time,
    closing_time
FROM    (
           SELECT store_id,
                  Substring(store_date,1,10) AS store_date,
                  CASE
                         WHEN Substring(opening_time,1,5)>'09:30' THEN
                                (
                                       SELECT Substring(opening_time,1,5))
                  END AS opening_time,
                  CASE
                         WHEN Substring(closing_time,1,5)<'22:30' THEN
                                (
                                       SELECT Substring(closing_time,1,5))
                  END AS closing_time
           FROM   store_operation_metrics
           WHERE  store_date BETWEEN '${data.fromDate}' AND    '${data.toDate}'
           AND    store_id              IN (${data.storeId})
           AND    composite_inserted_at IN
                  (
                           SELECT   max(composite_inserted_at)
                           FROM     store_operation_metrics
                           WHERE    store_date BETWEEN '${data.fromDate}' AND      '${data.toDate}'
                           AND      store_id IN (${data.storeId})
                           GROUP BY store_date,
                                    store_id))
ORDER BY store_id,
    store_date`.normalize()
}
// late open stores table
module.exports.lateopen_stores_table = (data) => {
    return `SELECT store_date,
    store_id,
    opening_at
FROM
(SELECT store_id,
       substring(store_date, 1, 10) AS store_date,
       substring(opening_time, 1, 5) AS opening_at
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
  AND store_id in (${data.storeId})
  AND substring(opening_time, 1, 5)>'09:30'
  AND composite_inserted_at in
    (SELECT max(composite_inserted_at)
     FROM store_operation_metrics
     WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
       AND store_id in (${data.storeId})
     GROUP BY store_date,
              store_id))
ORDER BY store_date,
      store_id
${data.limit_query}`.normalize();
}

// late open stores Count
module.exports.lateopen_stores_count = (data) => {
    return `SELECT count(*) AS total_records_count
    FROM
      (SELECT store_date,
              store_id,
              opening_at
       FROM
         (SELECT store_id,
                 substring(store_date, 1, 10) AS store_date,
                 substring(opening_time, 1, 5) AS opening_at
          FROM store_operation_metrics
          WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
            AND store_id in (${data.storeId})
            AND substring(opening_time, 1, 5)>'09:30'
            AND composite_inserted_at in
              (SELECT max(composite_inserted_at)
               FROM store_operation_metrics
               WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                 AND store_id in (${data.storeId})
               GROUP BY store_date,
                        store_id))
       ORDER BY store_date,
                store_id)`.normalize();
}

// Early close stores table
module.exports.earlyclose_stores_table = (data) => {
    return`SELECT store_date,
    store_id,
    closing_at
FROM
(SELECT store_id,
       substring(store_date, 1, 10) AS store_date,
       substring(closing_time, 1, 5) AS closing_at
FROM store_operation_metrics
WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
  AND store_id in (${data.storeId})
  AND substring(closing_time, 1, 5)<'22:30'
  AND composite_inserted_at in
    (SELECT max(composite_inserted_at)
     FROM store_operation_metrics
     WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
       AND store_id in (${data.storeId})
     GROUP BY store_date,
              store_id))
ORDER BY store_date,
      store_id ${data.limit_query}`.normalize();
}

// Early close stores count
module.exports.earlyclose_stores_count = (data) => {
    return`SELECT count(*) AS total_records_count
    FROM
      (SELECT store_date,
              store_id,
              closing_at
       FROM
         (SELECT store_id,
                 substring(store_date, 1, 10) AS store_date,
                 substring(closing_time, 1, 5) AS closing_at
          FROM store_operation_metrics
          WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
            AND store_id in (${data.storeId})
            AND substring(closing_time, 1, 5)<'22:30'
            AND composite_inserted_at in
              (SELECT max(composite_inserted_at)
               FROM store_operation_metrics
               WHERE store_date BETWEEN '${data.fromDate}' AND '${data.toDate}'
                 AND store_id in (${data.storeId})
               GROUP BY store_date,
                        store_id))
       ORDER BY store_date,
                store_id)`.normalize();
}

// summery screen zone feature cards 
module.exports.zone_feature_cards = (data) =>{
    return `SELECT sum(footfall) AS total_footfall,
    sum(total_zone_time_spent) AS total_dwell_time,
    avg(avg_zone_time_spent) AS avg_dwell_time,
    sum(male_count) AS male_count,
    sum(female_count) AS female_count,
    sum(total_zone_time_spent) AS total_dwell_time,
    sum("1-12") AS "age_1-12",
    sum("13-19") AS "age_13-19",
    sum("20-30") AS "age_20-30",
    sum("31-45") AS "age_31-45",
    sum("46-59") AS "age_46-59",
    sum("60_above") AS "age_60_above"
FROM
(SELECT store_id,
       split_part(zones, '|', 1) AS zone_name,
       count(DISTINCT tempid) AS footfall,
       avg(split_part(zones, '|', 2)) AS avg_zone_time_spent,
       sum(split_part(zones, '|', 2)) AS total_zone_time_spent,
       sum(male_count) AS male_count,
       sum(female_count) AS female_count,
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
           END) AS "60_above"
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
                                   female_count
   FROM RC
   INNER JOIN
     (SELECT t1.store_date,
             t1.store_id,
             t1.tempid,
             zone_details,
             age,
             male_count,
             female_count
      FROM (
              (SELECT store_date,
                      store_id,
                      temp_id||store_date||store_id AS tempid,
                      zone_details
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
                 AND store_id in (${data.storeId})) AS t2 ON t1.tempid=t2.tempid))AS B ON RC.split_index <= REGEXP_COUNT(B.zone_details, ',') + 1)
WHERE zone_name !=''
GROUP BY store_id,
         zone_name)`.normalize();
}

// summary screen top performance based on dwell time
module.exports.top_perform_stores =(data) =>{
    return `SELECT p1.store_id,
    p2.avg_dwell_time AS avg_dwell_time,
    split_part(zone_name, '_', 1) AS most_visited_zone,
    split_part(zone_name, '_', 2) AS stream_id
FROM (
     (SELECT store_id,
             zone_name,
             avg(zone_time_spent) AS avg_dwell_time
      FROM
        (SELECT store_id,
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
               UNION ALL SELECT 100) SELECT store_date,
                                            store_id,
                                            tempid,
                                            TRIM(SPLIT_PART(B.zone_details, ',', RC.split_index)) AS zones
            FROM (RC
                  INNER JOIN
                    (SELECT store_date,
                            store_id,
                            temp_id||store_date||store_id AS tempid,
                            zone_details
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
                                   store_id) )AS B ON RC.split_index <= REGEXP_COUNT(B.zone_details, ',') + 1)))
      WHERE zone_name !=''
      GROUP BY store_id,
               zone_name) AS p1
   INNER JOIN
     (SELECT store_id,
             max(avg_dwell_time) AS avg_dwell_time
      FROM
        (SELECT store_id,
                zone_name,
                avg(zone_time_spent) AS avg_dwell_time
         FROM
           (SELECT store_id,
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
                  UNION ALL SELECT 100) SELECT store_date,
                                               store_id,
                                               tempid,
                                               TRIM(SPLIT_PART(B.zone_details, ',', RC.split_index)) AS zones
               FROM (RC
                     INNER JOIN
                       (SELECT store_date,
                               store_id,
                               temp_id||store_date||store_id AS tempid,
                               zone_details
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
                                      store_id) )AS B ON RC.split_index <= REGEXP_COUNT(B.zone_details, ',') + 1)))
         WHERE zone_name !=''
         GROUP BY store_id,
                  zone_name)
      GROUP BY store_id) AS p2 ON p1.store_id=p2.store_id
   AND p1.avg_dwell_time=p2.avg_dwell_time)
ORDER BY avg_dwell_time DESC
LIMIT 10`.normalize();
}

module.exports.graph =(data) =>{
return `SELECT store_id,
       split_part(zone_name, '_', 1) AS zone_name,
       split_part(zone_name, '_', 2) AS stream_id,
       count(DISTINCT tempid) AS footfall,
       avg(zone_time_spent) AS avg_dwell_time
FROM
  (SELECT store_id,
          split_part(zones, '|', 1) AS zone_name,
          split_part(zones, '|', 2) AS zone_time_spent,
          tempid
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
                                      TRIM(SPLIT_PART(B.zone_details, ',', RC.split_index)) AS zones
      FROM (RC
            INNER JOIN
              (SELECT store_date,
                      store_id,
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
                             store_id) )AS B ON RC.split_index <= REGEXP_COUNT(B.zone_details, ',') + 1)))
WHERE zone_name !=''
GROUP BY store_id,
         zone_name
ORDER BY footfall DESC`.normalize();
}