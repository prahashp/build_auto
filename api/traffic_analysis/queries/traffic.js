// overall analysis (total footfall , avg dwell time) card 
module.exports.overallAnalysis = (data) =>{
   return `SELECT count(temp_id) AS total_foot_fall,
   avg(time_spent) AS average_dwell_time
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

// overall feature (bff, mo, con, overall)
module.exports.overAllFeature = (data) =>{
   return `SELECT SUM (CASE
      WHEN time_spent${data.query.brandConfigs.bouncedConfigTime}
           AND time_spent${data.query.brandConfigs.bouncedConfigTime} THEN 1
      ELSE 0
  END) AS bounced_footfall_count,
 SUM (CASE
          WHEN time_spent${data.query.brandConfigs.missedOpportunityStartTime}
               AND time_spent${data.query.brandConfigs.missedOpportunityEndTime} THEN 1
          ELSE 0
      END) AS missed_opportunity_count,
     SUM (CASE
              WHEN time_spent${data.query.brandConfigs.conversionConfigTime}
                   AND time_spent${data.query.brandConfigs.conversionConfigTime} THEN 1
              ELSE 0
          END) AS conversion_count,
         count(temp_id) AS overall
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

// group details card
module.exports.card = (data) => {
  return `select 
  count(group_head_count) as total_group_count, 
  avg(group_head_count) as avg_group_size, 
  sum(
    case when group_head_count = 1 then 1 else 0 end
  ) as specific_shopper, 
  sum(
    case when group_head_count > 1 then (
      select 
        group_head_count
    ) else 0 end
  ) as group_shopper 
  from 
  (
    select 
      group_id || store_date as groupid, 
      count(temp_id) as group_head_count 
    from 
      customer_time_metrics 
    where 
      date_time BETWEEN '${data.fromDate} 00:00:00' 
      and '${data.toDate} 23:59:59' 
      and store_id in ('${data.storeId}') 
      and temp_id != 0 
      and time_spent ${data.start}
      AND time_spent ${data.end} 
      and composite_inserted_at in (
        select 
          max(composite_inserted_at) 
        from 
          customer_time_metrics 
        where 
          date_time BETWEEN '${data.fromDate} 00:00:00' 
          and '${data.toDate} 23:59:59' 
          and store_id in ('${data.storeId}') 
        group by 
          store_date, 
          store_id
      ) 
    group by 
      groupid
  )`.normalize()
};

// demographics graph
module.exports.graph = (data) =>{
return `select 
count(t1.tempid) as footfall, 
sum(
  case WHEN age >= 1 
  AND age <= 12 THEN 1 ELSE 0 end
) as "1-12", 
sum(
  CASE WHEN age >= 13 
  AND age <= 19 THEN 1 ELSE 0 end
) as "13-19", 
sum(
  case WHEN age >= 20 
  AND age <= 30 THEN 1 ELSE 0 end
) as "20-30", 
sum(
  case WHEN age >= 31 
  AND age <= 45 THEN 1 ELSE 0 end
) as "31-45", 
sum(
  case WHEN age >= 46 
  AND age <= 59 THEN 1 ELSE 0 end
) as "46-59", 
sum(case WHEN age >= 60 THEN 1 ELSE 0 end) as "60_plus", 
sum(male_count) as male_count, 
sum(female_count) as female_count 
from 
(
  (
    select 
      temp_id || store_date as tempid, 
      age, 
      male_count, 
      female_count 
    from 
      customer_demographics 
    where 
      date_time BETWEEN '${data.fromDate} 00:00:00' 
      and '${data.toDate} 23:59:59' 
      and store_id in ('${data.storeId}') 
      and temp_id != 0
  ) as t1 
  inner join (
    select 
      temp_id || store_date as tempid 
    from 
      customer_time_metrics 
    where 
      date_time BETWEEN '${data.fromDate} 00:00:00' 
      and '${data.toDate} 23:59:59' 
      and store_id in ('${data.storeId}') 
      and temp_id != 0 
      and time_spent ${data.start}
      AND time_spent ${data.end}
      and composite_inserted_at in (
        select 
          max(composite_inserted_at) 
        from 
          customer_time_metrics 
        where 
          date_time BETWEEN '${data.fromDate} 00:00:00' 
          and '${data.toDate} 23:59:59' 
          and store_id in ('${data.storeId}') 
        group by 
          store_date, 
          store_id
      )
  ) as t2 on t1.tempid = t2.tempid
)`.normalize()
};

module.exports.timeBasedGrpAnalysis_prevdata = (data) => {
return `select 
date, 
store_id, 
group_head_count, 
group_temp_ids, 
store_id, 
time_range, 
case when avg_dwell_time ${data.query.brandConfigs.bouncedConfigTime} then 'bounced' 
when avg_dwell_time ${data.query.brandConfigs.missedOpportunityStartTime} 
and avg_dwell_time ${data.query.brandConfigs.missedOpportunityEndTime} then 'missed'
 when avg_dwell_time ${data.query.brandConfigs.conversionConfigTime} then 'conversion' else 'NA' end as group_type, 
avg_dwell_time, 
case WHEN avg_age >= 1 
AND avg_age <= 12 THEN '1-12' WHEN avg_age >= 13 
AND avg_age <= 19 THEN '13-19' WHEN avg_age >= 20 
AND avg_age <= 30 THEN '20-30' WHEN avg_age >= 31 
AND avg_age <= 45 THEN '31-45' WHEN avg_age >= 46 
AND avg_age <= 59 THEN '46-59' WHEN avg_age >= 60 THEN '60_above' else 'NA' end as avg_age_range, 
male_count, 
female_count, 
substring(
  (
    timestamp 'epoch' + group_entry_time * interval '1 second'
  ), 
  12, 
  5
) as group_entry_time, 
substring(
  (
    timestamp 'epoch' + group_exit_time * interval '1 second'
  ), 
  12, 
  5
) as group_exit_time 
from 
(
  select 
    store_date as date, 
    store_id, 
    extract(
      hour 
      from 
        date_time
    ) as time_range, 
    count(t1.temp_id) as group_head_count, 
    sum(male_count) as male_count, 
    sum(female_count) as female_count, 
    avg(age) as avg_age, 
    avg(time_spent) as avg_dwell_time, 
    min(entry_time) as group_entry_time, 
    max(exit_time) as group_exit_time, 
    listagg(t2.temp_id, ',') as group_temp_ids 
  from 
    (
      (
        select 
          store_date, 
          store_id, 
          date_time, 
          temp_id, 
          age, 
          male_count, 
          female_count 
        from 
          customer_demographics 
        where 
          date_time BETWEEN '${data.imageDate} 00:00:00' 
          and '${data.imageDate} 23:59:59' 
          and store_id in ('${data.storeId}') 
          and temp_id != 0
      ) as t1 
      inner join (
        select 
          group_id, 
          temp_id, 
          entry_time, 
          exit_time, 
          time_spent 
        from 
          customer_time_metrics 
        where 
          date_time BETWEEN '${data.imageDate} 00:00:00' 
          and '${data.imageDate} 23:59:59' 
          and store_id in ('${data.storeId}') 
          and temp_id != 0 
          and composite_inserted_at in (
            select 
              max(composite_inserted_at) 
            from 
              customer_time_metrics 
            where 
              date_time BETWEEN '${data.imageDate} 00:00:00' 
              and '${data.imageDate} 23:59:59' 
              and store_id in ('${data.storeId}') 
            group by 
              store_date, 
              store_id
          )
      ) as t2 on t1.temp_id = t2.temp_id
    ) 
  group by 
    store_date, 
    store_id, 
    time_range, 
    group_id
) 
where 
time_range in (${data.time_range}) 
order by 
time_range`.normalize()
};

module.exports.timeBasedGrpAnalysis_thumbdata = (data) => {
   return `select store_date AS date,time_range,count(group_head_count) AS groups,
  listagg(group_temp_ids, ',') AS group_tempids, store_id
  from 
    (SELECT store_date,
            extract(HOUR
                    FROM date_time) AS time_range,
            group_id,
            count(temp_id) AS group_head_count
    ,listagg(temp_id, ',') AS group_temp_ids, store_id
     FROM customer_time_metrics
     WHERE date_time BETWEEN '${data.imageDate} 00:00:00' AND '${data.imageDate} 23:59:59'
       AND store_id in ('${data.storeId}')
       AND temp_id!=0
       AND composite_inserted_at in
         (SELECT max(composite_inserted_at)
          FROM customer_time_metrics
          WHERE date_time BETWEEN '${data.imageDate} 00:00:00' AND '${data.imageDate} 23:59:59'
            AND store_id in ('${data.storeId}')
          GROUP BY store_date,
                   store_id)
     GROUP BY store_date,
              time_range,
              group_id,store_id)
  GROUP BY date,time_range,store_id
  ORDER BY time_range`.normalize()
};

module.exports.rangeAnalysisGrp_thumbdata = (data) => {
return `SELECT 
date, 
group_head_count AS group_range, 
count(group_head_count) AS groups, 
listagg(group_temp_ids, ',') AS group_temp_ids , store_id
FROM 
(
  SELECT 
    store_date AS date, 
    group_id, 
    count(temp_id) AS group_head_count, 
    listagg(
      temp_id || '_' || extract(
        hour 
        from 
          date_time
      ), 
      ','
    ) AS group_temp_ids,store_id 
  FROM 
    customer_time_metrics 
  WHERE 
    date_time BETWEEN '${data.imageDate} 00:00:00' 
    AND '${data.imageDate} 23:59:59' 
    AND store_id in ('${data.storeId}') 
    AND temp_id != 0 
    AND composite_inserted_at in (
      SELECT 
        max(composite_inserted_at) 
      FROM 
        customer_time_metrics 
      WHERE 
        date_time BETWEEN '${data.imageDate} 00:00:00' 
        AND '${data.imageDate} 23:59:59' 
        AND store_id in ('${data.storeId}') 
      GROUP BY 
        store_date, 
        store_id
    ) 
  GROUP BY 
    date, 
    group_id,store_id
) 
GROUP BY 
date, 
group_head_count ,store_id
ORDER BY 
group_range
`.normalize()
};

module.exports.rangeAnalysisGrp_prevdata=(data)=>{
return `select 
date, 
store_id, 
group_head_count as group_range, store_id,
substring(
  (
    timestamp 'epoch' + group_entry_time * interval '1 second'
  ), 
  12, 
  2
) as hour, 
group_temp_ids, 
case when avg_dwell_time ${data.query.brandConfigs.bouncedConfigTime} then 'bounced'
when avg_dwell_time ${data.query.brandConfigs.missedOpportunityStartTime} and 
avg_dwell_time ${data.query.brandConfigs.missedOpportunityEndTime} then 'missed'
 when avg_dwell_time ${data.query.brandConfigs.conversionConfigTime} then 'conversion' else 'NA' end as group_type, 
avg_dwell_time, 
case WHEN avg_age >= 1 
AND avg_age <= 12 THEN '1-12' WHEN avg_age >= 13 
AND avg_age <= 19 THEN '13-19' WHEN avg_age >= 20 
AND avg_age <= 30 THEN '20-30' WHEN avg_age >= 31 
AND avg_age <= 45 THEN '31-45' WHEN avg_age >= 46 
AND avg_age <= 59 THEN '46-59' WHEN avg_age >= 60 THEN '60+' else 'NA' end as avg_age_range, 
male_count, 
female_count, 
substring(
  (
    timestamp 'epoch' + group_entry_time * interval '1 second'
  ), 
  12, 
  5
) as group_entry_time, 
substring(
  (
    timestamp 'epoch' + group_exit_time * interval '1 second'
  ), 
  12, 
  5
) as group_exit_time 
from 
(
  select 
    store_date as date, 
    store_id, 
    count(t1.temp_id) as group_head_count, 
    sum(male_count) as male_count, 
    sum(female_count) as female_count, 
    avg(age) as avg_age, 
    avg(time_spent) as avg_dwell_time, 
    min(entry_time) as group_entry_time, 
    max(exit_time) as group_exit_time, 
    listagg(t2.temp_id, ',') as group_temp_ids 
  from 
    (
      (
        select 
          store_date, 
          store_id, 
          date_time, 
          temp_id, 
          age, 
          male_count, 
          female_count 
        from 
          customer_demographics 
        where 
          date_time BETWEEN '${data.imageDate} 00:00:00' 
          and '${data.imageDate} 23:59:59' 
          and store_id in ('${data.storeId}') 
          and temp_id != 0
      ) as t1 
      inner join (
        select 
          group_id, 
          temp_id, 
          entry_time, 
          exit_time, 
          time_spent 
        from 
          customer_time_metrics 
        where 
          date_time BETWEEN '${data.imageDate} 00:00:00' 
          and '${data.imageDate} 23:59:59' 
          and store_id in ('${data.storeId}') 
          and temp_id != 0 
          and composite_inserted_at in (
            select 
              max(composite_inserted_at) 
            from 
              customer_time_metrics 
            where 
              date_time BETWEEN '${data.imageDate} 00:00:00' 
              and '${data.imageDate} 23:59:59' 
              and store_id in ('${data.storeId}') 
            group by 
              store_date, 
              store_id
          )
      ) as t2 on t1.temp_id = t2.temp_id
    ) 
  group by 
    store_date, 
    store_id, 
    group_id
) 
where 
group_range in (1, 2, 3, 4, 5, 6) 
order by 
group_range`.normalize()
}

//table
module.exports.table =(data) =>{

return `SELECT date,sum(group_head_count) AS footfall,
count(group_head_count) AS group_count,
avg(group_head_count) AS avg_head_count,
sum("1-12") AS "age_1-12",
sum("13-19") AS "age_13-19",
sum("20-30") AS "age_20-30",
sum("31-45") AS "age_31-45",
sum("46-59") AS "age_46-59",
sum("60+") AS "age_60_plus",
sum(male_count) AS male_count,
sum(female_count) AS female_count
FROM
(SELECT store_date AS date,
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
      temp_id||store_date AS tempid,
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
 AND store_id in ('${data.storeId}')
 AND temp_id!=0
GROUP BY store_date,
        store_id,
        tempid) AS t1
INNER JOIN
(SELECT group_id,
      temp_id||store_date AS tempid,
      entry_time,
      exit_time,
      time_spent
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
GROUP BY store_date,
group_id)
GROUP BY date
ORDER BY date
${data.limit_query}`.normalize();
};

//table count
module.exports.table_count =(data) =>{
 return `SELECT count(*) AS total_records_count
 FROM
   (SELECT date,sum(group_head_count) AS footfall,
                count(group_head_count) AS group_count,
                avg(group_head_count) AS avg_head_count,
                sum("1-12") AS "age_1-12",
                sum("13-19") AS "age_13-19",
                sum("20-30") AS "age_20-30",
                sum("31-45") AS "age_31-45",
                sum("46-59") AS "age_46-59",
                sum("60+") AS "age_60_plus",
                sum(male_count) AS male_count,
                sum(female_count) AS female_count
    FROM
      (SELECT store_date AS date,
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
                      temp_id||store_date AS tempid,
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
                 AND store_id in ('${data.storeId}')
                 AND temp_id!=0
               GROUP BY store_date,
                        store_id,
                        tempid) AS t1
            INNER JOIN
              (SELECT group_id,
                      temp_id||store_date AS tempid,
                      entry_time,
                      exit_time,
                      time_spent
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
       GROUP BY store_date,
                group_id)
    GROUP BY date)`.normalize();
  };