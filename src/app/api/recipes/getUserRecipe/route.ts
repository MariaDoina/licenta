// import { getDataFromToken } from "@/lib/helpers/getDataFromToken";
// import { NextResponse, NextRequest } from "next/server";
// import { connect } from "@/db/dbConfig";
// import User from "@/models/userModel";

// connect();

// export async function GET(request: NextRequest) {
//   try {
//     const userId = await getDataFromToken(request);

//     const user = await User.findById(userId)
//       .select("recipes")
//       .populate({
//         path: "recipes",
//         model: "recipes",
//         select: "-__v",
//       })
//       .exec();

//     console.log("Recipes received:", user.recipes);

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       recipes: user.recipes || [],
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         message: "Error verifying token or fetching recipes",
//         success: false,
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
