// Embedded India pincode dataset – prioritizes Tamil Nadu, covers all major states
export interface PincodeEntry {
  pincode: string;
  postOffice: string;
  area: string;
  city: string;
  district: string;
  state: string;
}

// Tamil Nadu entries (prioritized)
const TAMIL_NADU: PincodeEntry[] = [
  // Chennai
  { pincode: '600001', postOffice: 'GPO Chennai', area: 'George Town', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600002', postOffice: 'Egmore', area: 'Egmore', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600003', postOffice: 'Park Town', area: 'Park Town', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600004', postOffice: 'Royapuram', area: 'Royapuram', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600005', postOffice: 'Royapettah', area: 'Royapettah', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600006', postOffice: 'Triplicane', area: 'Triplicane', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600007', postOffice: 'Purasawalkam', area: 'Purasawalkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600008', postOffice: 'Chetpet', area: 'Chetpet', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600010', postOffice: 'Kilpauk', area: 'Kilpauk', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600011', postOffice: 'Perambur', area: 'Perambur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600012', postOffice: 'Perambur Barracks', area: 'Perambur Barracks', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600014', postOffice: 'Saidapet', area: 'Saidapet', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600015', postOffice: 'Nandanam', area: 'Nandanam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600017', postOffice: 'T Nagar', area: 'T Nagar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600018', postOffice: 'Mylapore', area: 'Mylapore', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600020', postOffice: 'Adyar', area: 'Adyar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600024', postOffice: 'Kodambakkam', area: 'Kodambakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600026', postOffice: 'Ashok Nagar', area: 'Ashok Nagar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600028', postOffice: 'Teynampet', area: 'Teynampet', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600031', postOffice: 'Alandur', area: 'Alandur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600033', postOffice: 'Pallavaram', area: 'Pallavaram', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600034', postOffice: 'Nanganallur', area: 'Nanganallur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600036', postOffice: 'Velachery', area: 'Velachery', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600040', postOffice: 'Anna Nagar', area: 'Anna Nagar', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600042', postOffice: 'Villivakkam', area: 'Villivakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600044', postOffice: 'Kolathur', area: 'Kolathur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600045', postOffice: 'Anna Nagar West', area: 'Anna Nagar West', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600050', postOffice: 'Vadapalani', area: 'Vadapalani', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600053', postOffice: 'Valasaravakkam', area: 'Valasaravakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600058', postOffice: 'Ambattur', area: 'Ambattur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600059', postOffice: 'Mogappair', area: 'Mogappair', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600062', postOffice: 'Avadi', area: 'Avadi', city: 'Chennai', district: 'Tiruvallur', state: 'Tamil Nadu' },
  { pincode: '600069', postOffice: 'Madipakkam', area: 'Madipakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600073', postOffice: 'Guindy', area: 'Guindy', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600078', postOffice: 'Porur', area: 'Porur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600083', postOffice: 'Tambaram', area: 'Tambaram', city: 'Chennai', district: 'Chengalpattu', state: 'Tamil Nadu' },
  { pincode: '600085', postOffice: 'Chromepet', area: 'Chromepet', city: 'Chennai', district: 'Chengalpattu', state: 'Tamil Nadu' },
  { pincode: '600088', postOffice: 'Medavakkam', area: 'Medavakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600091', postOffice: 'Sholinganallur', area: 'Sholinganallur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600096', postOffice: 'Kelambakkam', area: 'Kelambakkam', city: 'Chennai', district: 'Chengalpattu', state: 'Tamil Nadu' },
  { pincode: '600097', postOffice: 'OMR', area: 'OMR Thoraipakkam', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600100', postOffice: 'Perungudi', area: 'Perungudi', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  { pincode: '600119', postOffice: 'Thiruvanmiyur', area: 'Thiruvanmiyur', city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
  // Coimbatore
  { pincode: '641001', postOffice: 'Coimbatore HO', area: 'Town Hall', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641002', postOffice: 'RS Puram', area: 'RS Puram', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641003', postOffice: 'Peelamedu', area: 'Peelamedu', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641004', postOffice: 'Singanallur', area: 'Singanallur', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641005', postOffice: 'Saravanampatti', area: 'Saravanampatti', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641006', postOffice: 'Ganapathy', area: 'Ganapathy', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641011', postOffice: 'Gandhipuram', area: 'Gandhipuram', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641012', postOffice: 'Ramanathapuram', area: 'Ramanathapuram', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641014', postOffice: 'Race Course', area: 'Race Course', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641018', postOffice: 'Ukkadam', area: 'Ukkadam', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641025', postOffice: 'Podanur', area: 'Podanur', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641035', postOffice: 'Vadavalli', area: 'Vadavalli', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641041', postOffice: 'Kovaipudur', area: 'Kovaipudur', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  { pincode: '641045', postOffice: 'Thudiyalur', area: 'Thudiyalur', city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu' },
  // Madurai
  { pincode: '625001', postOffice: 'Madurai HO', area: 'Meenakshi Temple Area', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625002', postOffice: 'Madurai North', area: 'Tallakulam', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625003', postOffice: 'Teppakulam', area: 'Teppakulam', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625007', postOffice: 'KK Nagar Madurai', area: 'KK Nagar', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625009', postOffice: 'Anna Nagar Madurai', area: 'Anna Nagar', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625010', postOffice: 'Iyer Bungalow', area: 'Iyer Bungalow', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625014', postOffice: 'Thirunagar', area: 'Thirunagar', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625016', postOffice: 'Vilangudi', area: 'Vilangudi', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  { pincode: '625020', postOffice: 'SS Colony', area: 'SS Colony', city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu' },
  // Trichy
  { pincode: '620001', postOffice: 'Trichy HO', area: 'Trichy Fort', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { pincode: '620002', postOffice: 'Trichy Cantonment', area: 'Cantonment', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { pincode: '620005', postOffice: 'KK Nagar Trichy', area: 'KK Nagar', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { pincode: '620008', postOffice: 'Srirangam', area: 'Srirangam', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { pincode: '620010', postOffice: 'Thillai Nagar', area: 'Thillai Nagar', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { pincode: '620017', postOffice: 'Woraiyur', area: 'Woraiyur', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { pincode: '620020', postOffice: 'Tennur', area: 'Tennur', city: 'Tiruchirappalli', district: 'Tiruchirappalli', state: 'Tamil Nadu' },
  // Salem
  { pincode: '636001', postOffice: 'Salem HO', area: 'Swarnapuri', city: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
  { pincode: '636002', postOffice: 'Suramangalam', area: 'Suramangalam', city: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
  { pincode: '636004', postOffice: 'Hasthampatti', area: 'Hasthampatti', city: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
  { pincode: '636006', postOffice: 'Alagapuram', area: 'Alagapuram', city: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
  { pincode: '636007', postOffice: 'Fairlands', area: 'Fairlands', city: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
  { pincode: '636008', postOffice: 'Shevapet', area: 'Shevapet', city: 'Salem', district: 'Salem', state: 'Tamil Nadu' },
  // Erode
  { pincode: '638001', postOffice: 'Erode HO', area: 'Erode Town', city: 'Erode', district: 'Erode', state: 'Tamil Nadu' },
  { pincode: '638003', postOffice: 'Surampatti', area: 'Surampatti', city: 'Erode', district: 'Erode', state: 'Tamil Nadu' },
  { pincode: '638004', postOffice: 'Veerappanchatram', area: 'Veerappanchatram', city: 'Erode', district: 'Erode', state: 'Tamil Nadu' },
  // Tirunelveli
  { pincode: '627001', postOffice: 'Tirunelveli HO', area: 'Palayamkottai', city: 'Tirunelveli', district: 'Tirunelveli', state: 'Tamil Nadu' },
  { pincode: '627002', postOffice: 'Tirunelveli Town', area: 'Tirunelveli Town', city: 'Tirunelveli', district: 'Tirunelveli', state: 'Tamil Nadu' },
  { pincode: '627003', postOffice: 'Melapalayam', area: 'Melapalayam', city: 'Tirunelveli', district: 'Tirunelveli', state: 'Tamil Nadu' },
  { pincode: '627006', postOffice: 'Tirunelveli Junction', area: 'Junction Area', city: 'Tirunelveli', district: 'Tirunelveli', state: 'Tamil Nadu' },
  // Thanjavur
  { pincode: '613001', postOffice: 'Thanjavur HO', area: 'Thanjavur Fort', city: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu' },
  { pincode: '613002', postOffice: 'Medical College', area: 'Medical College Road', city: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu' },
  { pincode: '613005', postOffice: 'Pattukottai Road', area: 'Pattukottai Road', city: 'Thanjavur', district: 'Thanjavur', state: 'Tamil Nadu' },
  // Vellore
  { pincode: '632001', postOffice: 'Vellore HO', area: 'Vellore Fort', city: 'Vellore', district: 'Vellore', state: 'Tamil Nadu' },
  { pincode: '632002', postOffice: 'Vellore Bazaar', area: 'Vellore Bazaar', city: 'Vellore', district: 'Vellore', state: 'Tamil Nadu' },
  { pincode: '632004', postOffice: 'Katpadi', area: 'Katpadi', city: 'Vellore', district: 'Vellore', state: 'Tamil Nadu' },
  // Thoothukudi
  { pincode: '628001', postOffice: 'Thoothukudi HO', area: 'Thoothukudi Town', city: 'Thoothukudi', district: 'Thoothukudi', state: 'Tamil Nadu' },
  { pincode: '628002', postOffice: 'Thoothukudi Port', area: 'Harbour Area', city: 'Thoothukudi', district: 'Thoothukudi', state: 'Tamil Nadu' },
  { pincode: '628003', postOffice: 'Millerpuram', area: 'Millerpuram', city: 'Thoothukudi', district: 'Thoothukudi', state: 'Tamil Nadu' },
  // Tiruppur
  { pincode: '641601', postOffice: 'Tiruppur HO', area: 'Tiruppur Town', city: 'Tiruppur', district: 'Tiruppur', state: 'Tamil Nadu' },
  { pincode: '641602', postOffice: 'Tiruppur North', area: 'Tiruppur North', city: 'Tiruppur', district: 'Tiruppur', state: 'Tamil Nadu' },
  { pincode: '641604', postOffice: 'Palladam Road', area: 'Palladam Road', city: 'Tiruppur', district: 'Tiruppur', state: 'Tamil Nadu' },
  // Dindigul
  { pincode: '624001', postOffice: 'Dindigul HO', area: 'Dindigul Town', city: 'Dindigul', district: 'Dindigul', state: 'Tamil Nadu' },
  { pincode: '624002', postOffice: 'Dindigul Fort', area: 'Fort Area', city: 'Dindigul', district: 'Dindigul', state: 'Tamil Nadu' },
  // Kanchipuram
  { pincode: '631501', postOffice: 'Kanchipuram HO', area: 'Kanchipuram Town', city: 'Kanchipuram', district: 'Kanchipuram', state: 'Tamil Nadu' },
  { pincode: '631502', postOffice: 'Big Kanchipuram', area: 'Big Kanchipuram', city: 'Kanchipuram', district: 'Kanchipuram', state: 'Tamil Nadu' },
  // Nagercoil
  { pincode: '629001', postOffice: 'Nagercoil HO', area: 'Nagercoil Town', city: 'Nagercoil', district: 'Kanyakumari', state: 'Tamil Nadu' },
  { pincode: '629002', postOffice: 'Kottar', area: 'Kottar', city: 'Nagercoil', district: 'Kanyakumari', state: 'Tamil Nadu' },
  // Kumbakonam
  { pincode: '612001', postOffice: 'Kumbakonam HO', area: 'Kumbakonam Town', city: 'Kumbakonam', district: 'Thanjavur', state: 'Tamil Nadu' },
  { pincode: '612002', postOffice: 'Kumbakonam East', area: 'Kumbakonam East', city: 'Kumbakonam', district: 'Thanjavur', state: 'Tamil Nadu' },
  // Cuddalore
  { pincode: '607001', postOffice: 'Cuddalore HO', area: 'Cuddalore Town', city: 'Cuddalore', district: 'Cuddalore', state: 'Tamil Nadu' },
  { pincode: '607002', postOffice: 'Cuddalore Port', area: 'Old Town', city: 'Cuddalore', district: 'Cuddalore', state: 'Tamil Nadu' },
];

// Other major Indian states
const OTHER_STATES: PincodeEntry[] = [
  // Karnataka
  { pincode: '560001', postOffice: 'Bangalore GPO', area: 'MG Road', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '560034', postOffice: 'Koramangala', area: 'Koramangala', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '560038', postOffice: 'Indiranagar', area: 'Indiranagar', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '560066', postOffice: 'Whitefield', area: 'Whitefield', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '560076', postOffice: 'HSR Layout', area: 'HSR Layout', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '560095', postOffice: 'Electronic City', area: 'Electronic City', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '560100', postOffice: 'Marathahalli', area: 'Marathahalli', city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' },
  { pincode: '570001', postOffice: 'Mysore HO', area: 'Mysore City', city: 'Mysuru', district: 'Mysuru', state: 'Karnataka' },
  // Kerala
  { pincode: '695001', postOffice: 'Thiruvananthapuram', area: 'Palayam', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala' },
  { pincode: '682001', postOffice: 'Ernakulam HO', area: 'MG Road', city: 'Kochi', district: 'Ernakulam', state: 'Kerala' },
  { pincode: '673001', postOffice: 'Kozhikode HO', area: 'Kozhikode Town', city: 'Kozhikode', district: 'Kozhikode', state: 'Kerala' },
  // Andhra Pradesh
  { pincode: '520001', postOffice: 'Vijayawada HO', area: 'Vijayawada Town', city: 'Vijayawada', district: 'Krishna', state: 'Andhra Pradesh' },
  { pincode: '530001', postOffice: 'Visakhapatnam HO', area: 'Vizag Town', city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { pincode: '515001', postOffice: 'Anantapur HO', area: 'Anantapur Town', city: 'Anantapur', district: 'Anantapur', state: 'Andhra Pradesh' },
  // Telangana
  { pincode: '500001', postOffice: 'Hyderabad GPO', area: 'Abids', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
  { pincode: '500033', postOffice: 'Jubilee Hills', area: 'Jubilee Hills', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
  { pincode: '500081', postOffice: 'Madhapur', area: 'Madhapur', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
  { pincode: '500084', postOffice: 'Kondapur', area: 'Kondapur', city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
  // Maharashtra
  { pincode: '400001', postOffice: 'Mumbai GPO', area: 'Fort', city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra' },
  { pincode: '400050', postOffice: 'Bandra West', area: 'Bandra West', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra' },
  { pincode: '400069', postOffice: 'Andheri East', area: 'Andheri East', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra' },
  { pincode: '400076', postOffice: 'Powai', area: 'Powai', city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra' },
  { pincode: '411001', postOffice: 'Pune GPO', area: 'Camp', city: 'Pune', district: 'Pune', state: 'Maharashtra' },
  { pincode: '411038', postOffice: 'Hinjewadi', area: 'Hinjewadi', city: 'Pune', district: 'Pune', state: 'Maharashtra' },
  // Delhi
  { pincode: '110001', postOffice: 'Connaught Place', area: 'Connaught Place', city: 'New Delhi', district: 'New Delhi', state: 'Delhi' },
  { pincode: '110017', postOffice: 'Saket', area: 'Saket', city: 'New Delhi', district: 'South Delhi', state: 'Delhi' },
  { pincode: '110075', postOffice: 'Dwarka', area: 'Dwarka', city: 'New Delhi', district: 'South West Delhi', state: 'Delhi' },
  { pincode: '110085', postOffice: 'Rohini', area: 'Rohini', city: 'New Delhi', district: 'North West Delhi', state: 'Delhi' },
  // UP
  { pincode: '226001', postOffice: 'Lucknow GPO', area: 'Hazratganj', city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh' },
  { pincode: '201301', postOffice: 'Noida', area: 'Noida', city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh' },
  { pincode: '208001', postOffice: 'Kanpur HO', area: 'Kanpur City', city: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh' },
  // Rajasthan
  { pincode: '302001', postOffice: 'Jaipur GPO', area: 'MI Road', city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan' },
  { pincode: '313001', postOffice: 'Udaipur HO', area: 'Udaipur City', city: 'Udaipur', district: 'Udaipur', state: 'Rajasthan' },
  // Gujarat
  { pincode: '380001', postOffice: 'Ahmedabad GPO', area: 'Lal Darwaza', city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat' },
  { pincode: '395001', postOffice: 'Surat GPO', area: 'Surat City', city: 'Surat', district: 'Surat', state: 'Gujarat' },
  // West Bengal
  { pincode: '700001', postOffice: 'Kolkata GPO', area: 'BBD Bagh', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal' },
  { pincode: '700016', postOffice: 'Park Street', area: 'Park Street', city: 'Kolkata', district: 'Kolkata', state: 'West Bengal' },
  { pincode: '700091', postOffice: 'Salt Lake', area: 'Salt Lake', city: 'Kolkata', district: 'North 24 Parganas', state: 'West Bengal' },
  // Bihar
  { pincode: '800001', postOffice: 'Patna GPO', area: 'Patna City', city: 'Patna', district: 'Patna', state: 'Bihar' },
  // Madhya Pradesh
  { pincode: '462001', postOffice: 'Bhopal GPO', area: 'New Market', city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh' },
  { pincode: '452001', postOffice: 'Indore GPO', area: 'Rajwada', city: 'Indore', district: 'Indore', state: 'Madhya Pradesh' },
  // Punjab
  { pincode: '160001', postOffice: 'Chandigarh HO', area: 'Sector 17', city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh' },
  { pincode: '141001', postOffice: 'Ludhiana HO', area: 'Ludhiana City', city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab' },
  // Haryana
  { pincode: '122001', postOffice: 'Gurgaon HO', area: 'Gurgaon City', city: 'Gurugram', district: 'Gurugram', state: 'Haryana' },
  // Odisha
  { pincode: '751001', postOffice: 'Bhubaneswar GPO', area: 'Old Town', city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha' },
  // Assam
  { pincode: '781001', postOffice: 'Guwahati GPO', area: 'Pan Bazaar', city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam' },
  // Jharkhand
  { pincode: '834001', postOffice: 'Ranchi HO', area: 'Main Road', city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand' },
  // Chhattisgarh
  { pincode: '492001', postOffice: 'Raipur GPO', area: 'Sadar Bazaar', city: 'Raipur', district: 'Raipur', state: 'Chhattisgarh' },
  // Goa
  { pincode: '403001', postOffice: 'Panaji HO', area: 'Panaji City', city: 'Panaji', district: 'North Goa', state: 'Goa' },
  // Uttarakhand
  { pincode: '248001', postOffice: 'Dehradun GPO', area: 'Paltan Bazaar', city: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand' },
  // J&K
  { pincode: '180001', postOffice: 'Jammu HO', area: 'Jammu City', city: 'Jammu', district: 'Jammu', state: 'Jammu & Kashmir' },
  { pincode: '190001', postOffice: 'Srinagar GPO', area: 'Lal Chowk', city: 'Srinagar', district: 'Srinagar', state: 'Jammu & Kashmir' },
  // HP
  { pincode: '171001', postOffice: 'Shimla GPO', area: 'Mall Road', city: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh' },
];

export const ALL_PINCODES: PincodeEntry[] = [...TAMIL_NADU, ...OTHER_STATES];

// Build lookup indexes
const pincodeIndex = new Map<string, PincodeEntry[]>();
const searchIndex: { key: string; entry: PincodeEntry }[] = [];

ALL_PINCODES.forEach((entry) => {
  // pincode index
  const existing = pincodeIndex.get(entry.pincode) || [];
  existing.push(entry);
  pincodeIndex.set(entry.pincode, existing);

  // search index (area, postOffice, city)
  searchIndex.push({ key: entry.area.toLowerCase(), entry });
  searchIndex.push({ key: entry.postOffice.toLowerCase(), entry });
  searchIndex.push({ key: entry.city.toLowerCase(), entry });
});

export function lookupByPincode(pincode: string): PincodeEntry[] {
  return pincodeIndex.get(pincode) || [];
}

export function searchLocations(query: string, limit = 10): PincodeEntry[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();

  // Check if query is a pincode (digits only)
  if (/^\d+$/.test(q)) {
    const results: PincodeEntry[] = [];
    const seen = new Set<string>();
    for (const [pin, entries] of pincodeIndex) {
      if (pin.startsWith(q)) {
        for (const e of entries) {
          const key = `${e.pincode}-${e.area}`;
          if (!seen.has(key)) {
            seen.add(key);
            results.push(e);
            // Prioritize Tamil Nadu
          }
        }
      }
      if (results.length >= limit * 2) break;
    }
    // Sort: Tamil Nadu first
    return results
      .sort((a, b) => {
        if (a.state === 'Tamil Nadu' && b.state !== 'Tamil Nadu') return -1;
        if (a.state !== 'Tamil Nadu' && b.state === 'Tamil Nadu') return 1;
        return 0;
      })
      .slice(0, limit);
  }

  // Text search
  const seen = new Set<string>();
  const results: PincodeEntry[] = [];

  for (const { key, entry } of searchIndex) {
    if (key.includes(q)) {
      const uid = `${entry.pincode}-${entry.area}`;
      if (!seen.has(uid)) {
        seen.add(uid);
        results.push(entry);
      }
    }
    if (results.length >= limit * 2) break;
  }

  return results
    .sort((a, b) => {
      if (a.state === 'Tamil Nadu' && b.state !== 'Tamil Nadu') return -1;
      if (a.state !== 'Tamil Nadu' && b.state === 'Tamil Nadu') return 1;
      return 0;
    })
    .slice(0, limit);
}
