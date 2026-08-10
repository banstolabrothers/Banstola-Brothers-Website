// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   ShoppingCart,
//   Plus,
//   Minus,
//   Trash2,
//   ArrowRight,
//   ChevronUp,
//   X,
// } from "lucide-react";

// const CartComponent = () => {
//   const [availableItems] = useState([
//     {
//       id: 1,
//       name: "Lay's Chips",
//       price: 20,
//       image:
//         "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=80&h=80&fit=crop",
//     },
//     {
//       id: 2,
//       name: "Kurkure",
//       price: 20,
//       image:
//         "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=80&h=80&fit=crop",
//     },
//     {
//       id: 3,
//       name: "Haldiram's",
//       price: 25,
//       image:
//         "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=80&h=80&fit=crop",
//     },
//     {
//       id: 4,
//       name: "Doritos",
//       price: 30,
//       image:
//         "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=80&h=80&fit=crop",
//     },
//     {
//       id: 5,
//       name: "Pringles",
//       price: 35,
//       image:
//         "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=80&h=80&fit=crop",
//     },
//     {
//       id: 6,
//       name: "Cheetos",
//       price: 28,
//       image:
//         "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=80&h=80&fit=crop",
//     },
//     {
//       id: 7,
//       name: "Bingo",
//       price: 22,
//       image:
//         "https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=80&h=80&fit=crop",
//     },
//   ]);

//   const [cartItems, setCartItems] = useState([]);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isCheckoutClicked, setIsCheckoutClicked] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [projectiles, setProjectiles] = useState([]);

//   const handleExpandToggle = (expand) => {
//     setIsTransitioning(true);
//     setIsExpanded(expand);
//     setTimeout(() => setIsTransitioning(false), 600);
//   };

//   const addToCart = (item, event) => {
//     const rect = event.currentTarget.getBoundingClientRect();
//     const startX = rect.left + rect.width / 2;
//     const startY = rect.top + rect.height / 2;

//     const projectileId = Date.now() + Math.random();
//     setProjectiles((prev) => [
//       ...prev,
//       {
//         id: projectileId,
//         item,
//         startX,
//         startY,
//       },
//     ]);

//     setTimeout(() => {
//       setProjectiles((prev) => prev.filter((p) => p.id !== projectileId));
//     }, 800);

//     setCartItems((items) => {
//       const existing = items.find((i) => i.id === item.id);
//       if (existing) {
//         return items.map((i) =>
//           i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
//         );
//       }
//       return [...items, { ...item, quantity: 1 }];
//     });
//   };

//   const updateQuantity = (id, delta) => {
//     setCartItems((items) =>
//       items
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max(0, item.quantity + delta) }
//             : item,
//         )
//         .filter((item) => item.quantity > 0),
//     );
//   };

//   const removeItem = (id) => {
//     setCartItems((items) => items.filter((item) => item.id !== id));
//   };

//   const clearCart = () => {
//     setCartItems([]);
//     setIsExpanded(false);
//   };

//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );

//   return (
//     <section className="min-h-96 bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <h2 className="text-2xl font-bold mb-6 text-black">Available Items</h2>
//         <div className="grid grid-cols-7 gap-3 mb-8">
//           {availableItems.map((item) => (
//             <motion.div
//               key={item.id}
//               whileHover={{ scale: 1.05, y: -4 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={(e) => addToCart(item, e)}
//               className="bg-white rounded-xl p-3 cursor-pointer shadow-md hover:shadow-xl transition-shadow border border-gray-200"
//             >
//               <motion.img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-full h-16 object-cover rounded-lg mb-2"
//                 whileHover={{ scale: 1.1, rotate: 5 }}
//               />
//               <p className="text-xs font-semibold text-black text-center line-clamp-1">
//                 {item.name}
//               </p>
//               <p className="text-xs text-gray-600 text-center font-bold">
//                 ${item.price}
//               </p>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Projectile animations */}
//       <AnimatePresence>
//         {projectiles.map((projectile) => (
//           <motion.div
//             key={projectile.id}
//             initial={{
//               position: "fixed",
//               left: projectile.startX,
//               top: projectile.startY,
//               x: "-50%",
//               y: "-50%",
//               scale: 1,
//               opacity: 1,
//               zIndex: 9999,
//             }}
//             animate={{
//               left: "38%",
//               top: "100%",
//               x: "-10%",
//               y: "-85px",
//               scale: 0.5,
//               opacity: 0.8,
//             }}
//             exit={{
//               opacity: 0,
//               scale: 0,
//             }}
//             transition={{
//               duration: 0.6,
//               // ease: [0.34, 1.56, 0.64, 1],
//             }}
//             className="pointer-events-none"
//           >
//             <img
//               src={projectile.item.image}
//               alt={projectile.item.name}
//               className="w-16 h-16 object-cover rounded-xl shadow-2xl border-2 border-white"
//             />
//           </motion.div>
//         ))}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isExpanded && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
//             onClick={() => handleExpandToggle(false)}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {cartItems.length > 0 && (
//           <motion.div
//             initial={{ y: "100%" }}
//             animate={{ y: 0 }}
//             exit={{ y: "100%" }}
//             transition={{
//               type: "spring",
//               damping: 32,
//               stiffness: 320,
//               mass: 0.9,
//             }}
//             className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center pointer-events-none"
//           >
//             <div className="w-full max-w-lg px-4 pb-4 pointer-events-auto">
//               <motion.div
//                 layout
//                 onClick={() => !isExpanded && handleExpandToggle(true)}
//                 className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
//                   !isExpanded ? "cursor-pointer" : ""
//                 }`}
//                 transition={{
//                   layout: {
//                     type: "spring",
//                     damping: 32,
//                     stiffness: 320,
//                     mass: 0.9,
//                   },
//                 }}
//                 whileHover={!isExpanded ? { scale: 1.02, y: -4 } : {}}
//               >
//                 {!isExpanded ? (
//                   <motion.div
//                     layout
//                     className="px-5 py-4"
//                     transition={{
//                       layout: {
//                         type: "spring",
//                         damping: 32,
//                         stiffness: 320,
//                       },
//                     }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <motion.div
//                         layout
//                         className="flex items-center gap-4 min-w-0 flex-1"
//                       >
//                         <motion.div
//                           layout
//                           className="flex items-center shrink-0"
//                           style={{ marginLeft: "0px" }}
//                         >
//                           {cartItems.map((item, index) => (
//                             <motion.img
//                               key={item.id}
//                               layoutId={`cart-image-${item.id}`}
//                               src={item.image}
//                               alt={item.name}
//                               className="w-10 h-10 object-cover rounded-xl border-2 border-white shadow-lg"
//                               style={{
//                                 marginLeft: index === 0 ? "0px" : "-26px",
//                                 zIndex: cartItems.length - index,
//                               }}
//                               transition={{
//                                 type: "spring",
//                                 damping: 28,
//                                 stiffness: 400,
//                               }}
//                               whileHover={{
//                                 scale: 1.15,
//                                 rotate: 8,
//                                 zIndex: 100,
//                               }}
//                             />
//                           ))}
//                         </motion.div>
//                         <motion.div layout className="text-left min-w-0">
//                           <motion.div
//                             layout
//                             className="text-xs text-gray-600 font-medium whitespace-nowrap"
//                           >
//                             {totalItems} item{totalItems !== 1 ? "s" : ""}
//                           </motion.div>
//                           <motion.div
//                             layout
//                             key={`amount-${totalAmount}`}
//                             className="font-bold text-xl text-black whitespace-nowrap"
//                           >
//                             ${totalAmount}
//                           </motion.div>
//                         </motion.div>
//                       </motion.div>

//                       <motion.button
//                         layout
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           setIsCheckoutClicked(true);
//                           setTimeout(() => setIsCheckoutClicked(false), 800);
//                         }}
//                         className="relative bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg overflow-hidden shrink-0"
//                         style={{
//                           paddingTop: "10px",
//                           paddingBottom: "10px",
//                         }}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         animate={{
//                           paddingLeft: isCheckoutClicked ? "20px" : "20px",
//                           paddingRight: isCheckoutClicked ? "20px" : "20px",
//                         }}
//                         transition={{
//                           paddingLeft: { duration: 0.3 },
//                           paddingRight: { duration: 0.3 },
//                         }}
//                       >
//                         <AnimatePresence mode="wait">
//                           {!isCheckoutClicked ? (
//                             <motion.div
//                               key="cart-icon"
//                               initial={{
//                                 opacity: 0,
//                                 y: 20,
//                                 filter: "blur(4px)",
//                               }}
//                               animate={{
//                                 opacity: 1,
//                                 y: 0,
//                                 filter: "blur(0px)",
//                               }}
//                               exit={{
//                                 opacity: 0,
//                                 y: -20,
//                                 filter: "blur(4px)",
//                                 transition: { duration: 0.3 },
//                               }}
//                               className="flex items-center gap-2"
//                             >
//                               <motion.div
//                                 animate={{ rotate: [0, -10, 10, -10, 0] }}
//                                 transition={{
//                                   duration: 0.5,
//                                   repeat: Infinity,
//                                   repeatDelay: 3,
//                                 }}
//                               >
//                                 <ShoppingCart size={16} />
//                               </motion.div>
//                               <span className="text-sm whitespace-nowrap">
//                                 Checkout
//                               </span>
//                             </motion.div>
//                           ) : (
//                             <motion.div
//                               key="arrow-icon"
//                               initial={{
//                                 opacity: 0,
//                                 y: 20,
//                                 filter: "blur(4px)",
//                               }}
//                               animate={{
//                                 opacity: 1,
//                                 y: 0,
//                                 filter: "blur(0px)",
//                               }}
//                               exit={{
//                                 opacity: 0,
//                                 y: -20,
//                                 filter: "blur(4px)",
//                                 transition: { duration: 0.3 },
//                               }}
//                               className="flex items-center gap-2"
//                             >
//                               <motion.div
//                                 animate={{ x: [0, 4, 0] }}
//                                 transition={{
//                                   duration: 0.6,
//                                   repeat: Infinity,
//                                 }}
//                               >
//                                 <ArrowRight size={16} />
//                               </motion.div>
//                               <span className="text-sm whitespace-nowrap">
//                                 Process
//                               </span>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       </motion.button>

//                       <motion.button
//                         layout
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           clearCart();
//                         }}
//                         className="relative bg-red-600 text-white p-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center shadow-lg shrink-0 ml-2"
//                         whileHover={{ scale: 1.15, rotate: 90 }}
//                         whileTap={{ scale: 0.85, rotate: 45 }}
//                       >
//                         <X size={20} />
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 ) : (
//                   <motion.div
//                     layout
//                     className="flex flex-col"
//                     style={{ height: "70vh", maxHeight: "550px" }}
//                     transition={{
//                       layout: {
//                         type: "spring",
//                         damping: 32,
//                         stiffness: 320,
//                       },
//                     }}
//                   >
//                     <motion.div
//                       layout
//                       className="flex items-center justify-between px-5 py-4 border-b bg-white shrink-0"
//                     >
//                       <motion.h3
//                         layout
//                         className="text-lg font-bold text-black whitespace-nowrap"
//                       >
//                         My Cart ({totalItems} items)
//                       </motion.h3>
//                       <motion.button
//                         whileHover={{ scale: 1.15, rotate: 180 }}
//                         whileTap={{ scale: 0.85 }}
//                         transition={{ type: "spring", stiffness: 400 }}
//                         onClick={() => handleExpandToggle(false)}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
//                       >
//                         <ChevronUp size={24} />
//                       </motion.button>
//                     </motion.div>

//                     <motion.div
//                       className="flex-1 overflow-y-auto px-5 py-4"
//                       animate={{
//                         filter: isTransitioning ? "blur(2px)" : "blur(0px)",
//                         opacity: isTransitioning ? 0.3 : 1,
//                       }}
//                       transition={{
//                         filter: { duration: 0.3, ease: "easeInOut" },
//                         opacity: { duration: 0.1, ease: "easeInOut" },
//                       }}
//                     >
//                       <AnimatePresence mode="popLayout">
//                         {cartItems.map((item, index) => (
//                           <motion.div
//                             key={item.id}
//                             layout
//                             initial={{ opacity: 0, x: -50, scale: 0.8 }}
//                             animate={{
//                               opacity: 1,
//                               x: 0,
//                               scale: 1,
//                               transition: {
//                                 delay: isTransitioning ? 0 : index * 0.02,
//                                 type: "spring",
//                                 stiffness: 400,
//                                 damping: 28,
//                               },
//                             }}
//                             exit={{
//                               opacity: 0,
//                               x: 50,
//                               scale: 0.8,
//                               height: 0,
//                               marginBottom: 0,
//                               paddingBottom: 0,
//                               transition: {
//                                 type: "spring",
//                                 stiffness: 500,
//                                 damping: 30,
//                               },
//                             }}
//                             whileHover={{ scale: 1.03, x: 4 }}
//                             className="flex items-center gap-3 mb-4 pb-4 border-b last:border-b-0"
//                           >
//                             <motion.img
//                               layoutId={`cart-image-${item.id}`}
//                               src={item.image}
//                               alt={item.name}
//                               className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0"
//                               whileHover={{ scale: 1.15, rotate: 8 }}
//                               transition={{
//                                 type: "spring",
//                                 stiffness: 400,
//                                 damping: 25,
//                               }}
//                             />
//                             <div className="flex-1 min-w-0">
//                               <motion.h4
//                                 layout
//                                 className="font-semibold text-sm line-clamp-2 text-black"
//                               >
//                                 {item.name}
//                               </motion.h4>
//                               <motion.p
//                                 layout
//                                 className="text-black font-bold mt-1 whitespace-nowrap"
//                               >
//                                 ${item.price}
//                               </motion.p>
//                             </div>
//                             <motion.div
//                               layout
//                               className="flex items-center gap-2 shrink-0"
//                             >
//                               <motion.button
//                                 whileHover={{ scale: 1.25 }}
//                                 whileTap={{ scale: 0.85, rotate: -90 }}
//                                 onClick={() => updateQuantity(item.id, -1)}
//                                 className="w-8 h-8 flex items-center justify-center bg-gray-100 text-black rounded-full hover:bg-gray-200 transition-colors font-bold shrink-0"
//                               >
//                                 <Minus size={16} />
//                               </motion.button>
//                               <motion.span
//                                 key={`quantity-${item.id}-${item.quantity}`}
//                                 initial={{ scale: 1.5, color: "#000" }}
//                                 animate={{ scale: 1, color: "#000" }}
//                                 transition={{
//                                   type: "spring",
//                                   stiffness: 500,
//                                   damping: 15,
//                                 }}
//                                 className="w-8 text-center font-bold text-black whitespace-nowrap shrink-0"
//                               >
//                                 {item.quantity}
//                               </motion.span>
//                               <motion.button
//                                 whileHover={{ scale: 1.25 }}
//                                 whileTap={{ scale: 0.85, rotate: 90 }}
//                                 onClick={() => updateQuantity(item.id, 1)}
//                                 className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-bold shrink-0"
//                               >
//                                 <Plus size={16} />
//                               </motion.button>
//                             </motion.div>
//                             <motion.button
//                               whileHover={{ scale: 1.25, rotate: 15 }}
//                               whileTap={{ scale: 0.85, rotate: -15 }}
//                               onClick={() => removeItem(item.id)}
//                               className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors shrink-0"
//                             >
//                               <Trash2 size={18} />
//                             </motion.button>
//                           </motion.div>
//                         ))}
//                       </AnimatePresence>
//                     </motion.div>

//                     <motion.div
//                       layout
//                       className="border-t px-5 py-4 bg-gray-50 shrink-0"
//                     >
//                       <div className="flex justify-between mb-3">
//                         <span className="text-gray-700 font-medium whitespace-nowrap">
//                           Subtotal ({totalItems} items)
//                         </span>
//                         <motion.span
//                           key={`total-${totalAmount}`}
//                           initial={{ scale: 1.4 }}
//                           animate={{ scale: 1 }}
//                           transition={{
//                             type: "spring",
//                             stiffness: 400,
//                             damping: 12,
//                           }}
//                           className="font-bold text-black text-lg whitespace-nowrap"
//                         >
//                           ${totalAmount}
//                         </motion.span>
//                       </div>
//                       <motion.button
//                         whileHover={{
//                           scale: 1.04,
//                           boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
//                         }}
//                         whileTap={{ scale: 0.96 }}
//                         className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors shadow-lg"
//                       >
//                         <span className="whitespace-nowrap">
//                           Proceed to Checkout
//                         </span>
//                         <motion.div
//                           animate={{ x: [0, 6, 0] }}
//                           transition={{
//                             repeat: Infinity,
//                             duration: 1.2,
//                             ease: "easeInOut",
//                           }}
//                         >
//                           <ArrowRight size={20} />
//                         </motion.div>
//                       </motion.button>
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </section>
//   );
// };

// export default CartComponent;
